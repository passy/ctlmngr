/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var TransitionGroup = React.addons.TransitionGroup;
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
                    value: 0,
                    visible: true
                });

                setTimeout(function () {
                    this.setState({
                        value: data.value
                    });
                }.bind(this), 100);
            }.bind(this));

            this.on('uiHideProgressGlobal', function () {
                this.setState({
                    value: 100
                });
                setTimeout(function () {
                    this.replaceState({
                        value: 0,
                        visibile: false
                    });
                }.bind(this), 1000);
            }.bind(this));
        },

        renderProgressBar: function () {
            if (this.state.visible) {
                console.log('visible');
                return <div className="global-progress"
                    data-progress={this.state.value}>
                </div>;
            }

            return <span />;
        },

        render: function () {

            return <TransitionGroup transitionName="fade">
                {this.renderProgressBar()}
            </TransitionGroup>;
        }
    });
});
