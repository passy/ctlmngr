define(function (require) {
    'use strict';

    var Q = require('q');
    var Config = JSON.parse(require('text!config.json'));
    var _ = require('lodash');

    var READY_STATE_DONE = 4;
    var MAX_CURATE_SIZE = 100;

    var client;

    var Client = function (baseUrl) {
        this.baseUrl = baseUrl;
    };

    function mergeCTLResponses(oldCTL, newCTL) {
        return newCTL ? _.merge(newCTL, {
            objects: oldCTL.objects,
            response: {
                timeline: oldCTL.response.timeline
            }
        }, function (a, b) {
            return _.isArray(a) ? a.concat(b) : undefined;
        }) : oldCTL;
    }


    Client.getDefaultInstance = function () {
        if (!client) {
            client = new Client(Config.API_BASE);
        }

        return client;
    };

    Client.encodeQuery = function (query) {
        return Object.keys(query || {}).map(function (key) {
            return encodeURIComponent(_.string.underscored(key)) + '=' +
                encodeURIComponent(query[key]);
        }).join('&');
    };

    Client.normalizeCTLId = function (id) {
        return (_.string.startsWith(id, 'custom-')) ? id : 'custom-' + id;
    };

    Client.prototype.xhr = function (options) {
        var deferred = Q.defer();
        var xhr = new XMLHttpRequest();
        var params = '';

        xhr.withCredentials = !!options.withCredentials;

        if (options.params) {
            // Very simplistic, but should work for our limited use cases.
            params = '?' + Client.encodeQuery(options.params);
        }

        if (options.json) {
            options.headers = _.assign(options.headers || {}, {
                'Content-Type': 'application/json'
            });
            options.data = JSON.stringify(options.json);
        } else if (options.form) {
            options.headers = _.assign(options.headers || {}, {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            });
            options.data = Client.encodeQuery(options.form);
        }

        xhr.open(options.method, options.url + params, true);

        Object.keys(options.headers || {}).forEach(function (key) {
            xhr.setRequestHeader(key, options.headers[key]);
        });

        xhr.onreadystatechange = function (e) {
            if (xhr.readyState !== READY_STATE_DONE) {
                return;
            }

            if ([200, 304].indexOf(xhr.status) === -1) {
                var err = new Error('Server responded with status ' + xhr.status);
                err.status = xhr.status;
                err.xhr = xhr;

                deferred.reject(err);
            } else {
                deferred.resolve(e.target);
            }
        };

        xhr.send(options.data);

        return deferred.promise;
    };

    Client.prototype.request = function (url, method, options) {
        return this.xhr(_.extend({
            url: this.baseUrl + url,
            method: method || 'GET',
            withCredentials: true
        }, options)).then(function (xhr) {
            try {
                return JSON.parse(xhr.response);
            } catch (e) {
                console.warn('Unexpected non-JSON response: ', xhr.response);
                return xhr.response;
            }
        });
    };

    Client.prototype.login = function () {
        document.location.href = this.baseUrl + '/login?next=' +
            encodeURIComponent(document.location.href);
    };

    Client.prototype.logout = function () {
        return this.request('/logout', 'POST');
    };

    Client.prototype.getSession = function () {
        return this.request('/');
    };

    /**
     * Get a full user info response based on their user id.
     */
    Client.prototype.getUser = function (id, params) {
        /*jshint camelcase:false */
        return this.request('/1.1/users/show.json', 'GET', {
            params: _.extend({
                id: id
            }, params)
        });
    };

    Client.prototype.getCTLs = function (params) {
        return this.request('/1.1/beta/timelines/custom/list.json', 'GET', {
            params: params
        });
    };

    /**
     * Get a custom timeline, including *all* tweets in it.
     *
     * @callback progressCallback progressCb - A partial response, possibly not
     * containing all Tweets of the CTL.
     *
     * @param {string} id - CTL id
     * @param {object} params - URL parameters
     * @param {progressCallback} progressCb - Same as the resolved CTL, but
     * potentially partial
     *
     * @returns {object} Promise over the raw CTL response.
     */
    Client.prototype.getCTL = function (id, params, progressCb, _response) {
        return this.request('/1.1/beta/timelines/timeline.json', 'GET', {
            params: _.extend({
                id: Client.normalizeCTLId(id)
            }, params)
        }).then(function (response) {
            /*jshint camelcase:false */
            if (_.isFunction(progressCb)) {
                progressCb(response);
            }

            if (response.response.position.was_truncated) {
                return this.getCTL(
                    id,
                    _.extend({}, params, { max_position: response.response.position.min_position }),
                    progressCb,
                    mergeCTLResponses(response, _response)
                );
            } else {
                return mergeCTLResponses(response, _response);
            }
        }.bind(this));
    };

    /**
     * Creates a new CTL and (optionally) populates it with the given tweets in
     * order.
     *
     * @callback progressCallback progressCb - What should have gone through the
     * promise.
     *
     * @param {object} ctlParams - Object describing the new custom timeline.
     * @param {string} ctlParams.name - Name of the CTL.
     * @param {string} ctlParams.description - Description of the CTL.
     * @param {array=} tweetIds - List of Tweet IDs to add to the CTL.
     * @param {progressCallback} progressCb - Takes an object as parameter with
     * the keys {total, value}.
     *
     * @returns {object} Promise reporting the progress if tweetIds have been
     *                   specified.
     */
    Client.prototype.createCTL = function (ctlParams, tweetIds, progressCb) {
        var that = this;
        var createP = this.request(
            '/1.1/beta/timelines/custom/create.json',
            'POST', { form: {
                name: ctlParams.name,
                description: ctlParams.description
            } });
        tweetIds = tweetIds || [];

        if (!tweetIds.length) {
            return createP;
        }

        return createP.then(function (response) {
            var deferred = Q.defer();
            /*jshint camelcase:false */
            var ctlId = response.response.timeline_id;
            var counter = 0;
            var total = tweetIds.length;

            // These have to be executed sequentially and we want to resolve the
            // CTL response instead of the adding responses.
            console.log('reducing tweet ids:', tweetIds);
            tweetIds.reverse().reduce(function (prom, tweetId) {
                return prom.then(function () {
                    // Unfortunately, this doesn't bubble up at the moment and I
                    // can't really think of a pretty alternative to that.
                    deferred.notify(counter++);

                    if (_.isFunction(progressCb)) {
                        progressCb({
                            value: counter,
                            total: total
                        });
                    }
                }).then(that.addTweetToCTL.bind(that, ctlId, tweetId));
            }, Q()).then(deferred.resolve.bind(deferred, response),
                    deferred.reject.bind(deferred));

            // Make sure that we return just the response in the end.
            return deferred.promise;
        });
    };

    /**
     * Update the given properties on the CTL identified by ctlId.
     */
    Client.prototype.updateCTL = function (ctlId, props) {
        return this.request(
            '/1.1/beta/timelines/custom/update.json',
            'POST', {
                form: _.extend(props, {
                    id: Client.normalizeCTLId(ctlId)
                })
            }
        );
    };

    /**
     * Remove a CTL completely.
     *
     * @param ctlId {string} - ID of the CTL.
     *
     */
    Client.prototype.destroyCTL = function (ctlId) {
        return this.request(
            '/1.1/beta/timelines/custom/destroy.json',
            'POST', { form: {
                id: Client.normalizeCTLId(ctlId)
            } });
    };

    /**
     * Modify an existing CTL.
     *
     * An operation in `ops` has the following format:
     *
     * { op: OP, tweetId: TWEET_ID }
     *
     * whereby `OP` is either 'add' or 'remove' and `TWEET_ID` is the ID of the
     * Tweet.
     *
     * @param ctlId {string} - ID of the CTL.
     * @param ops {array} - Array of operations to apply to the CTL.
     *
     * @return {object} - promise over the response
     */
    Client.prototype.curateCTL = function (ctlId, ops) {
        ops = _.map(ops, function (op) {
            /*jshint camelcase:false */
            return { op: op.op, tweet_id: op.tweetId };
        });

        return this._batchCurateCTL(ctlId, ops);
    };

    Client.prototype._batchCurateCTL = function (ctlId, rawOps) {
        var ops = rawOps.splice(0, MAX_CURATE_SIZE);

        return this.request(
            '/1.1/beta/timelines/custom/curate.json',
            'POST', {
                json: {
                    id: Client.normalizeCTLId(ctlId),
                    changes: ops
                }
            }).then(function (result) {
                if (rawOps.length) {
                    return this._batchCurateCTL(ctlId, rawOps);
                }

                return result;
            }.bind(this));
    };


    /**
     * Overwrites the Tweets in an existing CTL by the given list of new Tweets.
     * This is one by removing all of the existing and adding the new ones
     * afterwards.
     *
     * @callback progressCallback progressCb - What should have gone through the
     * promise.
     *
     * @param {string} ctlId - ID of the CTL to replace.
     * @param {array=} tweetIds - List of Tweet IDs to add to the CTL.
     * @param {progressCallback} progressCb - Takes an object as parameter with
     * the keys {total, value}.
     *
     * @returns {object} Promise reporting the progress if tweetIds have been
     *                   specified.
     */
    Client.prototype.overwriteCTL = function (ctlId, tweetIds, progressCb) {
        return this.getCTL(ctlId).then(function (ctl) {
            progressCb({ value: 0, total: 1 });

            var removeOps = Object.keys(ctl.objects.tweets).map(function (key) {
                return {
                    tweetId: key,
                    op: 'remove'
                };
            });

            // Add them in the reverse order
            var addOps = tweetIds.reverse().map(function (id) {
                return {
                    tweetId: id,
                    op: 'add'
                };
            });

            return this.curateCTL(ctlId, removeOps.concat(addOps));
        }.bind(this));
    };

    Client.prototype.addTweetToCTL = function (ctlId, tweetId) {
        /*jshint camelcase:false */

        return this.request(
            '/1.1/beta/timelines/custom/add.json',
            'POST', { form: {
                id: ctlId,
                tweet_id: tweetId
            } });
    };

    return Client;
});
