/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var mediator = require('mediator');
    var withMediator = require('components/with_mediator');

    return React.createClass({
        mixins: [withMediator(mediator)],

        getInitialState: function () {
            return {
                session: null
            };
        },

        handleLogin: function (e) {
            e.preventDefault();

            this.trigger('uiLogin');
        },

        render: function () {
            return (
                <form className="text-center" onSubmit={this.handleLogin}>
                    <button className="btn-image cm-image-btn-sign-in" type="submit"></button>
                </form>
            );
        }
    });
});
