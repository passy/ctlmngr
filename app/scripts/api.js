define(function (require) {
    'use strict';

    var Q = require('q');
    var Config = require('json!config.json');
    var _ = require('lodash');

    var READY_STATE_DONE = 4;
    var client;

    var Client = function (baseUrl) {
        this.baseUrl = baseUrl;
    };

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

    Client.prototype.xhr = function (options) {
        var deferred = Q.defer();
        var xhr = new XMLHttpRequest();
        var params = '';

        xhr.withCredentials = !!options.withCredentials;

        if (options.params) {
            // Very simplistic, but should work for our limited use cases.
            params = '?' + Client.encodeQuery(options.params);
        }

        if (options.form) {
            options.headers = _.assign(options.headers || {}, {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
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

    Client.prototype.getCTLs = function (params) {
        return this.request('/1.1/beta/timelines/custom/list.json', 'GET', {
            params: params
        });
    };

    // https://api.twitter.com/1.1/beta/timelines/timeline.json?id=custom-41142710…clude_entities=1&include_user_entities=1&include_cards=1&send_error_codes=
    Client.prototype.getCTL = function (id, params) {
        return this.request('/1.1/beta/timelines/timeline.json', 'GET', {
            params: _.extend({
                id: (_.string.startsWith(id, 'custom-')) ? id : 'custom-' + id
            }, params)
        });
    };

    /**
     * Creates a new CTL and (optionally) populates it with the given tweets in
     * order.
     *
     * @param {object} ctlParams - Object describing the new custom timeline.
     * @param {string} ctlParams.name - Name of the CTL.
     * @param {string} ctlParams.description - Description of the CTL.
     * @param {array=} tweetIds - List of Tweet IDs to add to the CTL.
     *
     * @returns {object} Promise reporting the progress if tweetIds have been
     *                   specified.
     */
    Client.prototype.createCTL = function (ctlParams, tweetIds) {
        var that = this;
        var createP = this.request(
            '/1.1/beta/timelines/custom/create.json',
            'POST', { form: {
                name: ctlParams.name,
                description: ctlParams.description
            } });

        createP.then(function (response) {
            var deferred = Q.defer();
            /*jshint camelcase:false */
            var ctlId = response.response.timeline_id;
            var counter = 0;

            var tweetPs = (tweetIds || []).map(function (tweetId) {
                return that.addTweetToCTL(ctlId, tweetId).then(function (res) {
                    deferred.notify(++counter);

                    return res;
                });
            });

            // Make sure that we return the response in the end.
            return Q.all(tweetPs).then(deferred.promise);
        });

        return createP;
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
