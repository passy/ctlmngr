/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var classSet = React.addons.classSet;
    var client = window.api = require('api').getDefaultInstance();
    var mediator = require('mediator');
    var _ = require('lodash');

    var CMLoginButton = require('jsx!scripts/components/login_button.jsx?jsx');
    var CMSelectCTLStep = require('jsx!scripts/components/select_ctl_step.jsx?jsx');
    var CMTimelineStep = require('jsx!scripts/components/timeline_step.jsx?jsx');
    var WithMediator = require('components/with_mediator');

    var ProgressBar = React.createClass({
        render: function () {
            var perc = ~~(this.props.value /
                          (this.props.max - this.props.min) * 100) + '%';

            return <div className="progress progress-striped active">
                <div className="progress-bar" role="progressbar"
                    aria-valuenow={this.props.value}
                    aria-valuemin={this.props.min}
                    aria-valuemax={this.props.max}
                    style={{ width: perc }}>
                    <span className="sr-only">{perc + ' complete'}</span>
                </div>
            </div>;
        }
    });

    var CMSaveStep = React.createClass({
        mixins: [WithMediator(mediator)],

        getInitialState: function () {
            return {
                saving: null
            };
        },

        componentDidMount: function () {
            this.on('dataCreateCTL', this.handleCTLCreated);
            this.on('dataCreateCTLProgress', this.handleCTLProgress);
            this.on('dataError', this.handleDataError);
        },

        handleSubmit: function (e) {
            e.preventDefault();

            /*jshint camelcase:false */
            this.trigger('uiCreateCTL', {
                name: this.refs.name.getDOMNode().value,
                description: 'Automatically created by ctlmngr',
                tweetIds: this.props.tweets.map(function (x) { return x.id_str; })
            });

            this.setState({
                saving: { value: 0, total: this.props.tweets.length }
            });
        },

        handleCTLCreated: function () {
            // TODO: Improve?

            this.setState({
                saving: null
            });
            window.alert('CTL created. Better check TweetDeck if this actually worked.');
        },

        handleCTLProgress: function (data) {
            this.setState({
                saving: _.assign(this.state.saving, { value: data.value })
            });
        },

        handleDataError: function (e) {
            // TODO: Improve?
            console.error(e);
            window.alert('Shit went haywire.');
        },

        renderProgress: function () {
            if (!this.state.saving) {
                // XXX: Is there a better pattern for this?
                return <div />;
            }

            return <ProgressBar className="l-marg-v-n"
                min="0"
                max={this.state.saving.total}
                value={this.state.saving.value} />;
        },

        render: function () {
            // TODO: Description and option to overwrite existing
            if (!this.props.timeline) {
                return <div />;
            }

            var innerFormClasses = classSet({
                's-disabled': this.state.saving
            });

            return (
                <section className="clearfix">
                    <form className="center-block dim-half-width" onSubmit={this.handleSubmit}>
                        <h2>Step 3: Save your Custom Timeline</h2>

                        {this.renderProgress()}
                        <div className={innerFormClasses}>
                        <div className="input-group l-marg-b-n">
                            <label className="radio-inline">
                                <input ref="saveType" name="saveType" type="radio" checked />Create New
                            </label>
                            <label className="radio-inline" disabled>
                                <input ref="saveType" name="saveType" type="radio" disabled />Overwrite
                            </label>
                        </div>
                        <div className="input-group">
                            <input ref="name"
                                className="form-control"
                                type="text"
                                maxLength="25"
                                placeholder="Name of your new Timeline"
                                defaultValue={this.props.timeline.name} />
                            <span className="input-group-btn">
                                <button className="btn btn-default" type="submit">Save</button>
                            </span>
                        </div>
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

        resetSession: function () {
            this.replaceState(this.getInitialState());
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
            client.logout().then(this.resetSession);
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
