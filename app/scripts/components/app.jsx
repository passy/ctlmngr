/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var client = require('api').getDefaultInstance();
    var _ = require('lodash');

    var CMLoginButton = require('jsx!scripts/components/login_button.jsx?jsx');
    var CMSelectCTLStep = require('jsx!scripts/components/select_ctl_step.jsx?jsx');
    var CMTimelineStep = require('jsx!scripts/components/timeline_step.jsx?jsx');

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
            this.setState({
                timeline: ctl,
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
                </div>
                );
            } else {
                return <CMLoginButton session={this.state.session} />;
            }
        }
    });

});
