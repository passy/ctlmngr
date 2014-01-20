define(function (require) {
    'use strict';

    var Q = require('q');

    function DataBridge(mediator) {
        this.mediator = mediator;
    }

    DataBridge.prototype.listen = function () {
        this.mediator.subscribe('uiResolveCTL', this.resolveCTL.bind(this));
    };

    DataBridge.prototype.resolveCTL = function (id) {
        this.mediator.publish('dataResolveCTL', {
            promise: Q({ hello: 'world' })
        });
    };

    return DataBridge;
});
