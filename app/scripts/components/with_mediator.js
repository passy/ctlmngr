define(function () {
    'use strict';

    return function (mediator) {
        return {
            componentWillMount: function () {
                this.subscriptions = [];
            },

            componentWillUnmount: function () {
                this.subscriptions.forEach(mediator.off.bind(mediator));
            },

            on: function () {
                this.subscriptions.push(
                    mediator.on.apply(mediator, arguments).id
                );
            },

            trigger: function () {
                mediator.publish.apply(mediator, arguments);
            }
        };
    };
});
