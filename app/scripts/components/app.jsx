/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var client = require('api').getDefaultInstance();
    var mediator = require('mediator');

    var CMLoginButton = require('jsx!scripts/components/login_button.jsx?jsx');
    var CMSelectCTLStep = require('jsx!scripts/components/select_ctl_step.jsx?jsx');

    var CTL_RE = /^https?:\/\/twitter.com\/[^\/]+\/timelines\/(\d+)$/i;

    var CMTimelineStep = React.createClass({
        render: function () {
            if (!this.props.timeline) {
                return <div></div>;

            } else {
                return (
                    <section className="center-block dim-half-width">
                        <h2>Step 2: Reorder your Tweets</h2>
                        <div>
                            <pre>{JSON.stringify(this.props.timeline.objects, '  ')}</pre>
                        </div>
                    </section>
                );
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

        handleSelect: function (ctl) {
            this.setState({
                timeline: ctl
            });
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
                        <button className="btn btn-default btn-xs" onClick={this.handleLogout}>
                            Logout @{this.state.session.screen_name}
                        </button>
                    </div>
                    <CMSelectCTLStep timelines={this.state.timelines} onSelect={this.handleSelect} />
                    <CMTimelineStep timeline={this.state.timeline} />
                </div>
                );
            } else {
                return <CMLoginButton session={this.state.session} />;
            }
        }
    });

});
