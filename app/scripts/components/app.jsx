/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var CMLoginButton = require('jsx!scripts/components/login_button.jsx?jsx');
    var client = require('api').getDefaultInstance();

    return React.createClass({
        getInitialState: function () {
            return {
                session: null
            };
        },

        setSession: function (session) {
            this.setState({
                session: session
            });
        },

        handleSubmit: function (e) {
            e.preventDefault();
            console.log('Submitted.', e);
        },

        handleLogout: function () {
            client.logout().then(function () {
                this.setSession(null);
            }.bind(this));
        },

        render: function () {
            if (this.state.session) {
                return (
                    <section className="cm-app-shell">
                        <form className="center-block dim-half-width" onSubmit={this.handleSubmit}>
                            <div className="input-group">
                                <input className="form-control" type="url" placeholder="Custom Timeline URL" />
                                <span className="input-group-btn">
                                    <button className="btn btn-default" type="submit">Go!</button>
                                </span>
                            </div>
                        </form>
                        <div className="text-right">
                            <button className="btn btn-default btn-xs" onClick={this.handleLogout}>Logout</button>
                        </div>
                    </section>
                );
            } else {
                return <CMLoginButton session={this.state.session} />;
            }
        }
    });

});
