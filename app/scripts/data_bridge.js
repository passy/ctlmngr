/*jshint camelcase:false */
define(function (require) {
    'use strict';

    var client = require('api').getDefaultInstance();

    function DataBridge(mediator) {
        this.mediator = mediator;
    }

    DataBridge.prototype.listen = function () {
        this.mediator.subscribe('uiResolveCTL', this.resolveCTL.bind(this));
        this.mediator.subscribe('uiCreateCTL', this.createCTL.bind(this));
    };

    DataBridge.prototype.resolveCTL = function (data) {
        client.getCTL(data.id, {
            include_cards: 1,
            send_error_codes: 1,
            include_entites: 1
        }).then(function (response) {
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
            mediator.publish('dataCreateCTLProgress', {
                value: progress
            });
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

    return DataBridge;
});
