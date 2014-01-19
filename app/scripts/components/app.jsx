/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var CMLoginButton = require('jsx!scripts/components/login_button.jsx?jsx');
    var client = require('api').getDefaultInstance();

    var CMCTLList = React.createClass({
        renderCTLSelector: function (ctlKey) {
            var ctl = this.props.timelines[ctlKey];
            // TODO: Make this a button.
            return <li key={ctlKey}>
                <a href="#">{ctl.name} ({ctl.description})</a>
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

    return React.createClass({
        getInitialState: function () {
            return {
                session: null,
                timelines: {}
            };
        },

        setSession: function (session) {
            this.setState({
                session: session
            });
        },

        setTimelines: function (timelines) {
            this.setState({
                timelines: timelines
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
                    <section className="cm-app-shell clearfix">
                        <div className="pull-right">
                            <button className="btn btn-default btn-xs" onClick={this.handleLogout}>Logout</button>
                        </div>
                        <form className="center-block dim-half-width" onSubmit={this.handleSubmit}>
                            <div className="input-group">
                                <input className="form-control" type="url" placeholder="Enter a Custom Timeline URL" />
                                <span className="input-group-btn">
                                    <button className="btn btn-default" type="submit">Go!</button>
                                </span>
                            </div>
                            <div className="l-marg-t-n">
                                <CMCTLList timelines={this.state.timelines} />
                            </div>
                        </form>
                    </section>
                );
            } else {
                return <CMLoginButton session={this.state.session} />;
            }
        }
    });

});
