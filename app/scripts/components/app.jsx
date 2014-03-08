/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var client = require('api').getDefaultInstance();
    var _ = require('lodash');

    var mediator = require('mediator');
    var ctlResolver = require('ctl_resolver');
    var CMLoginButton = require('jsx!components/login_button');
    var CMSelectCTLStep = require('jsx!components/select_ctl_step');
    var CMTimelineStep = require('jsx!components/timeline_step');
    var CMSaveStep = require('jsx!components/save_step');
    var CMLoginMenu = require('jsx!components/login_menu');
    var WithMediator = require('components/with_mediator');

    return React.createClass({
        displayName: 'CMApp',

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
            this.on('dataCTLs', this.handleCTLsRefreshed);
            this.on('dataResolveCTL', this.handleTimelineResolved);
            this.on('dataLogout', this.handleLogout);
        },

        setSession: function (session) {
            this.setState({
                session: session
            });

            this.trigger('uiRefreshCTLs', {
                userId: session.user_id
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

        handleCTLsRefreshed: function (data) {
            this.setTimelines(data.response.objects.timelines);
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
            }).map(function (obj) {
                return _.assign(obj, { user: ctl.objects.users[obj.user.id_str] });
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
                    <CMLoginMenu
                        session={this.state.session} />

                    <CMSelectCTLStep
                        timeline={this.state.timeline}
                        timelines={this.state.timelines}
                        onSelect={this.handleSelect} />

                    <CMTimelineStep
                        timeline={this.state.timeline}
                        tweets={this.state.tweets}
                        onSort={this.handleSort}
                        />

                    <CMSaveStep
                        timeline={this.state.timeline}
                        tweets={this.state.tweets}
                        session={this.state.session} />
                </div>
                );
            } else {
                return <div className="cm-app">
                    <CMLoginMenu session={this.state.session} />
                    <CMLoginButton session={this.state.session} />
                </div>;
            }
        }
    });
});
