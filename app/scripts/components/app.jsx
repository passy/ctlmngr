/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var client = require('api').getDefaultInstance();
    var _ = require('lodash');

    var CMLoginButton = require('jsx!scripts/components/login_button.jsx?jsx');
    var CMSelectCTLStep = require('jsx!scripts/components/select_ctl_step.jsx?jsx');
    var CMTimelineStep = require('jsx!scripts/components/timeline_step.jsx?jsx');

    var CMSaveStep = React.createClass({
        handleSubmit: function (e) {
            e.preventDefault();

            console.log('Would be saving these tweets now:', this.props.tweets.map(function (x) { return x.text; }));
        },
        render: function () {
            // TODO: Description and option to overwrite existing
            if (!this.props.timeline) {
                return <div />;
            }

            return (
                <section className="clearfix">
                    <form className="center-block dim-half-width" onSubmit={this.handleSubmit}>
                        <h2>Step 3: Save your Custom Timeline</h2>
                        <div className="input-group">
                            <input ref="name" className="form-control" type="text" placeholder="Name of your new Timeline" value={this.props.timeline.name} />
                            <span className="input-group-btn">
                                <button className="btn btn-default" type="submit">Save</button>
                            </span>
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
                timelines: {},
                // Selected timeline we want to mess with
                timeline: null,
                // We keep tweets separately, even though they are part of the
                // timeline, because we manipulate those a lot and want to store
                // them in a different format.
                tweets: []
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
            // TODO: I think this should go through a URL change.

            var tweets = Object.keys(ctl.objects.tweets).map(function (key) {
                return _.assign({ key: key }, ctl.objects.tweets[key]);
            });
            var timeline = _.first(_.pairs(ctl.objects.timelines))[1];

            if (!timeline) {
                throw new Error('Unexpected CTL response: ' + JSON.stringify(ctl));
            }

            this.setState({
                timeline: timeline,
                tweets: tweets
            });
        },

        handleLogout: function () {
            client.logout().then(function () {
                this.setSession(null);
            }.bind(this));
        },

        handleSort: function (sortedItems) {
            this.setState({
                tweets: sortedItems
            });
        },

        render: function () {
            /*jshint camelcase:false */
            if (this.state.session) {
                return (
                <div className="cm-app">
                    <div className="pull-right">
                        <button className="btn btn-default btn-xs" onClick={this.handleLogout}>
                            Logout @{this.state.session.screen_name}
                        </button>
                    </div>
                    <CMSelectCTLStep timelines={this.state.timelines} onSelect={this.handleSelect} />
                    <CMTimelineStep timeline={this.state.timeline} tweets={this.state.tweets} onSort={this.handleSort} />
                    <CMSaveStep timeline={this.state.timeline} tweets={this.state.tweets} />
                </div>
                );
            } else {
                return <CMLoginButton session={this.state.session} />;
            }
        }
    });

});
