/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');

    return React.createClass({
        handleSelect: function (ctlKey, ctl, e) {
            e.preventDefault();
            this.props.onSelect(ctlKey, ctl);
        },

        renderCTLSelector: function (ctlKey) {
            var ctl = this.props.timelines[ctlKey];
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
                    <ul>
                        {Object.keys(this.props.timelines).map(this.renderCTLSelector)}
                    </ul>
                </div>;
            } else {
                return <div />;
            }
        }
    });
});
