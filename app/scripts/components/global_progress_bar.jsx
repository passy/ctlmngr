/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var mediator = require('mediator');
    var WithMediator = require('components/with_mediator');

    return React.createClass({
        mixins: [WithMediator(mediator)],

        getInitialState: function () {
            return {
                value: 0,
                visible: false
            };
        },

        componentDidMount: function () {
            this.on('uiShowProgressGlobal', function (data) {
                this.replaceState({
                    value: data.value
                });
            }.bind(this));

            this.on('uiHideProgressGlobal', function () {
                this.replaceState({
                    value: 0
                });
            }.bind(this));
        },

        render: function () {
            return <div className="global-progress"
                data-progress={this.state.value}>
            </div>;
        }
    });
});
