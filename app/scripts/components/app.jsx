/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var classSet = React.addons.classSet;
    var client = require('api').getDefaultInstance();
    var mediator = require('mediator');

    var CMLoginButton = require('jsx!scripts/components/login_button.jsx?jsx');
    var CMSelectCTLStep = require('jsx!scripts/components/select_ctl_step.jsx?jsx');

    var CTL_RE = /^https?:\/\/twitter.com\/[^\/]+\/timelines\/(\d+)$/i;

    var SortableList = React.createClass({
        getInitialState: function () {
            return {
                dragged: null
            };
        },

        render: function () {
            return <ul className="list-unstyled">
                {this.renderPlaceholders()}
            </ul>;
        },

        renderPlaceholders: function () {
            return this.props.children.map(function (child) {
                var key = child.props.key;

                if (!key) {
                    throw new Error('SortableItem children must have a key!');
                }

                var classes = classSet({
                    'dnd__item--dragged': this.state.dragged === key
                });

                return <li
                    draggable
                    className={classes}
                    onDragStart={this.handleDragStart.bind(this, key)}
                    onDragEnd={this.handleDragEnd.bind(this, key)}
                    key={key}>
                    {child}
                </li>;
            }.bind(this));
        },

        handleDragStart: function (key) {
            console.log('Setting key to', key);
            this.setState({
                dragged: key
            });
        },

        handleDragEnd: function (key) {
            this.setState({
                dragged: null
            });
        }
    });

    var CMTweet = React.createClass({
        render: function () {
            // Make sure to follow display guidelines here.
            return <div>
                <blockquote>{this.props.tweet.text}</blockquote>
            </div>;
        }
    });

    var CMTimelineStep = React.createClass({
        renderTweet: function (key) {
            var tweet = this.props.timeline.objects.tweets[key];
            return <CMTweet key={key} tweet={tweet} />;
        },
        render: function () {
            if (!this.props.timeline) {
                return <div></div>;
            } else {
                return (
                    <section className="center-block dim-half-width">
                        <h2>Step 2: Reorder your Tweets</h2>
                        <SortableList ref="list">
                            {Object.keys(this.props.timeline.objects.tweets).map(this.renderTweet)}
                        </SortableList>
                    </section>
                );
            }
        }
    });

    return React.createClass({
        getInitialState: function () {
            return {
                session: null,
                timelines: {},
                timeline: null
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
