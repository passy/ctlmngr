define(function (require) {
    'use strict';
    var Mediator = require('mediator-js').Mediator;

    // Create one singleton.
    return new Mediator();
});
