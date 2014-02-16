/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var _ = require('lodash');
    var TransitionGroup = React.addons.TransitionGroup;
    var classSet = React.addons.classSet;

    return React.createClass({
        handleSelect: function (ctlKey, ctl, e) {
            e.preventDefault();
            this.props.onSelect(ctlKey, ctl);
        },

        renderCTLSelector: function (ctlKey) {
            var ctl = this.props.timelines[ctlKey];
            var classes = classSet({
                'list-group-item': true,
                active: (
                    // We get the 'custom-' prefix that we cannot compare.
                    !_.isEmpty(this.props.selected) &&
                    ctlKey.indexOf(this.props.selected.id) === 7
                )
            });
            /*jshint camelcase:false */
            return (
                <a
                    key={ctlKey}
                    className={classes}
                    href={ctl.custom_timeline_url}
                    onClick={this.handleSelect.bind(null, ctlKey, ctl)}>
                    {ctl.name} ({ctl.description})
                </a>
            );
        },

        render: function () {
            if (Object.keys(this.props.timelines).length) {
                return <div>
                    <p>Or select from the list below:</p>
                    <TransitionGroup className="list-group" component={React.DOM.div} transitionName="roll-in">
                        {Object.keys(this.props.timelines).map(this.renderCTLSelector)}
                    </TransitionGroup>
                </div>;
            } else {
                return <div />;
            }
        }
    });
});
