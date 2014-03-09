/*jshint camelcase:false */
define(function (require) {
    'use strict';

    var client = require('api').getDefaultInstance();
    var Q = require('q');
    var _ = require('lodash');

    function DataBridge(mediator) {
        this.mediator = mediator;
    }

    DataBridge.prototype.listen = function () {
        this.mediator.subscribe('uiLogin', this.login.bind(this));
        this.mediator.subscribe('uiLogout', this.logout.bind(this));
        this.mediator.subscribe('uiRefreshCTLs', this.refreshCTLs.bind(this));
        this.mediator.subscribe('uiResolveCTL', this.resolveCTL.bind(this));
        this.mediator.subscribe('uiCreateCTL', this.createCTL.bind(this));
        this.mediator.subscribe('uiOverwriteCTL', this.overwriteCTL.bind(this));
        this.mediator.subscribe('uiUserInfo', this.getUserInfo.bind(this));

        this.mediator.subscribe('dataResolveCTLPartial', this.resolveCTL.bind(this));
    };

    DataBridge.prototype.login = function () {
        client.login();
    };

    DataBridge.prototype.logout = function (data) {
        client.logout().then(function () {
            this.mediator.publish('dataLogout', {
                key: data.key
            });
        }.bind(this), function (e) {
            this.mediator.publish('dataError', {
                method: 'uiLogout',
                status: e.status,
                message: 'Logging out failed',
                data: {}
            });
        }.bind(this)).done();
    };

    DataBridge.prototype.getUserInfo = function (data) {
        client.getUser(data.id).then(
            function (response) {
            this.mediator.publish('dataUserInfo', {
                key: data.key,
                response: response
            });
        }.bind(this), function (e) {
            this.mediator.publish('dataError', {
                method: 'uiUserInfo',
                status: e.status,
                message: 'Fetching user information failed.',
                data: data
            });
        }.bind(this)).done();
    };

    DataBridge.prototype.resolveCTL = function (data) {
        var options = {
            include_cards: 1,
            send_error_codes: 1,
            include_entites: 1
        };

        client.getCTL(data.id, options).then(function (response) {
            this.mediator.publish('dataResolveCTL', {
                ctl: response
            });
        }.bind(this), function (e) {
            this.mediator.publish('dataError', {
                method: 'resolveCTL',
                status: e.status,
                message: 'Resolving CLT failed.',
                data: data
            });
        }.bind(this)).done();
    };

    DataBridge.prototype.createCTL = function (data) {
        function handleProgress(mediator, progress) {
            console.log('Progress reported: ', progress);
            mediator.publish('dataCreateCTLProgress', progress);
        }

        client.createCTL({
            name: data.name,
            description: data.description
        }, data.tweetIds || [], handleProgress.bind(this, this.mediator))
        .then(function (response) {

            this.mediator.publish('dataCreateCTL', {
                // To identify the response
                key: data.key,
                response: response
            });
        }.bind(this), function (e) {
            this.mediator.publish('dataError', {
                method: 'createCTL',
                status: e.status,
                message: 'Creating CTL or attaching Tweets failed.',
                data: data
            });
        }.bind(this)).done();
    };

    /**
     * Overwrites the Tweets in an existing CTL.
     *
     * Expects data.id in addition to what createCtl expects.
     */
    DataBridge.prototype.overwriteCTL = function (data) {
        var promises = [];
        var updates = _.pick(data, ['description', 'name']);

        function handleProgress(mediator, progress) {
            mediator.publish('dataOverwriteCTLProgress', progress);
        }

        promises.push(client.overwriteCTL(
            data.id, data.tweetIds, handleProgress.bind(this, this.mediator)
        ));

        if (!_.isEmpty(updates)) {
            promises.push(client.updateCTL(data.id, updates));
        }

        // Execute both in parallel, but wait for them to finish before
        // returning.
        Q.all(promises).then(function (responses) {
            this.mediator.publish('dataOverwriteCTL', {
                key: data.key,
                response: responses[0]
            });
        }.bind(this), function (e) {
            this.mediator.publish('dataError', {
                method: 'overwriteCTL',
                status: e.status,
                message: 'Fetching or overwriting CTL failed.',
                data: data
            });
        }.bind(this)).done();
    };

    /**
     * Refreshes all CTLs for the given `userId`.
     */
    DataBridge.prototype.refreshCTLs = function (data) {
        client.getCTLs({
            userId: data.userId,
            sendErrorCodes: true
        }).then(function (response) {
            this.mediator.publish('dataCTLs', {
                key: data.key,
                response: response
            });
        }.bind(this), function (e) {
            this.mediator.publish('dataError', {
                method: 'refreshCTLs',
                status: e.status,
                message: 'Refreshing CTLs failed.',
                data: data
            });
        });
    };

    return DataBridge;
});
