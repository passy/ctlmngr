/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var TransitionGroup = React.addons.TransitionGroup;

    return React.createClass({
        handleSelect: function (ctlKey, ctl, e) {
            e.preventDefault();
            this.props.onSelect(ctlKey, ctl);
        },

        renderCTLSelector: function (ctlKey) {
            var ctl = this.props.timelines[ctlKey];
            /*jshint camelcase:false */
            return <li key={ctlKey}>
                <a href={ctl.custom_timeline_url} onClick={this.handleSelect.bind(null, ctlKey, ctl)}>
                    {ctl.name} ({ctl.description})
                </a>
            </li>;
        },

        render: function () {
            if (Object.keys(this.props.timelines).length) {
                return <div>
                    <p>Or select from the list below:</p>
                    <TransitionGroup component={React.DOM.ul} transitionName="roll-in">
                        {Object.keys(this.props.timelines).map(this.renderCTLSelector)}
                    </TransitionGroup>
                </div>;
            } else {
                return <div />;
            }
        }
    });
});
