/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var classSet = React.addons.classSet;

    return React.createClass({
        displayName: 'Spinner',

        getInitialProps: function () {
            return {
                size: '' // Can also be 'small' or 'large'
            };
        },

        render: function () {
            if (this.props.loading) {
                var classes = classSet({
                    'lea-spinner': true,
                    small: this.props.size === 'small',
                    large: this.props.size === 'large'
                });
                return (
                    <div className="text-center">
                        <div className={classes}><div>Loading…</div></div>
                    </div>
                );
            }

            return this.props.children;
        }
    });
});
