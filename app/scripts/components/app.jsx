/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var client = require('api').getDefaultInstance();
    var _ = require('lodash');

    var mediator = require('mediator');
    var ctlResolver = require('ctl_resolver');
    var CMLoginButton = require('jsx!scripts/components/login_button.jsx?jsx');
    var CMSelectCTLStep = require('jsx!scripts/components/select_ctl_step.jsx?jsx');
    var CMTimelineStep = require('jsx!scripts/components/timeline_step.jsx?jsx');
    var CMSaveStep = require('jsx!scripts/components/save_step.jsx?jsx');
    var WithMediator = require('components/with_mediator');

    return React.createClass({
        mixins: [WithMediator(mediator)],

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

        componentDidMount: function () {
            this.on('dataResolveCTL', this.handleTimelineResolved);
        },

        setSession: function (session) {
            this.setState({
                session: session
            });
        },

        resetSession: function () {
            this.replaceState(this.getInitialState());
        },

        setTimelines: function (timelines) {
            this.setState({
                timelines: timelines
            });
        },

        // TODO: I think this should go through a URL change.
        handleTimelineResolved: function (data) {
            /*jshint camelcase:false */

            var ctl = data.ctl;

            // Not 100% sure that I can always rely on the keys being present,
            // but this is some really neat FP stuff right here.
            var tweets = ctl.response.timeline.map(function (obj) {
                return obj.tweet;
            }).sort(function (a, b) {
                return a.sort_index < b.sort_index;
            }).map(function (obj) {
                return _.assign({ key: obj.id }, ctl.objects.tweets[obj.id]);
            });

            var timeline = _.first(_.pairs(ctl.objects.timelines))[1];

            if (!timeline) {
                throw new Error('Unexpected CTL response: ' + JSON.stringify(ctl));
            }

            // Augment timeline object with the actual id, because having just
            // the URL is silly.
            /*jshint camelcase:false */
            ctlResolver.resolveURL(timeline.custom_timeline_url).then(function (id) {
                timeline.id = id;

                this.setState({
                    timeline: timeline,
                    tweets: tweets
                });
            }.bind(this)).done();
            // No error handling cause this should never fail #famouslastwords
        },

        handleLogout: function () {
            client.logout().then(this.resetSession);
        },

        handleSelect: function (ctlKey) {
            // Reset the state and set the timeline to an empty object so we can
            // differentiate between an unselected and unloaded timeline.
            this.setState({
                timeline: {},
                tweets: []
            });

            this.trigger('uiResolveCTL', {
                id: ctlKey
            });
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
                    <CMSelectCTLStep timeline={this.state.timeline} timelines={this.state.timelines} onSelect={this.handleSelect} />
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
