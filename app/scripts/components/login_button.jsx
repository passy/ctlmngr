/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var client = require('api').getDefaultInstance();

    return React.createClass({
        getInitialState: function () {
            return {
                session: null
            };
        },

        handleLogin: function (e) {
            e.preventDefault();

            client.login();
        },

        render: function () {
            return (
                <form className="text-center" onSubmit={this.handleLogin}>
                    <button className="image-btn cm-image-btn-sign-in" type="submit"></button>
                </form>
            );
        }
    });
});
