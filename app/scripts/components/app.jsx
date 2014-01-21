/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var CMLoginButton = require('jsx!scripts/components/login_button.jsx?jsx');
    var client = require('api').getDefaultInstance();
    var mediator = require('mediator');

    var CMCTLList = React.createClass({
        handleSelect: function (ctl, e) {
            e.preventDefault();
            this.props.onSelect(ctl);
        },

        renderCTLSelector: function (ctlKey) {
            var ctl = this.props.timelines[ctlKey];
            // TODO: Make this a button.
            return <li key={ctlKey}>
                <a href={ctl.custom_timeline_url} onClick={this.handleSelect.bind(null, ctl)}>
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

    var CMSelectCTLStep = React.createClass({
        componentDidMount: function () {
            var that = this;

            mediator.subscribe('dataResolveCTL', function (data) {
                data.promise.then(function (ctl) {
                    that.handleSelect(ctl);
                }).done();
            });
        },

        handleSubmit: function (e) {
            e.preventDefault();

            var url = this.refs.url.getDOMNode().value.trim();
            // TODO: Find out ID

            mediator.publish('uiResolveCTL', {
                id: url
            });
        },

        handleSelect: function (ctl) {
             console.log('onSelect: ', ctl);
        },

        render: function () {
            return (
                <section className="clearfix">
                    <form className="center-block dim-half-width" onSubmit={this.handleSubmit}>
                        <h2>Step 1: Select a Custom Lineline</h2>
                        <div className="input-group">
                            <input ref="url" className="form-control" type="url" placeholder="Enter a Custom Timeline URL" />
                            <span className="input-group-btn">
                                <button className="btn btn-default" type="submit">Go!</button>
                            </span>
                        </div>
                        <div className="l-marg-t-n">
                            <CMCTLList timelines={this.props.timelines} onSelect={this.handleSelect} />
                        </div>
                    </form>
                </section>
            );
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

        handleSelect: function (e) {
            console.log('CTL selected:', e);
        },

        handleLogout: function () {
            client.logout().then(function () {
                this.setSession(null);
            }.bind(this));
        },

        render: function () {
            if (this.state.session) {
                return (
                <div className="cm-app">
                    <div className="pull-right">
                        <button className="btn btn-default btn-xs" onClick={this.handleLogout}>Logout</button>
                    </div>
                    <CMSelectCTLStep timelines={this.state.timelines} />
                </div>
                );
            } else {
                return <CMLoginButton session={this.state.session} />;
            }
        }
    });

});
