/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var classSet = React.addons.classSet;
    var client = require('api').getDefaultInstance();
    var _ = require('lodash');

    var CMLoginButton = require('jsx!scripts/components/login_button.jsx?jsx');
    var CMSelectCTLStep = require('jsx!scripts/components/select_ctl_step.jsx?jsx');

    var SortableList = React.createClass({
        getInitialState: function () {
            return {
                dragged: -1,
                placeholder: -1,
                // I initially just relied on the upstream component reacting to
                // onSort and updating the array before I realized that this is
                // a horrible idea because it breaks the isolation of the
                // component. You want the list to be sortable no matter what
                // the outer component does.
                items: this.props.items
            };
        },

        componentWillReceiveProps: function (props) {
            // Props take precedence state for items.
            this.setState({
                items: props.items
            });
        },

        render: function () {
            return <ul className="list-unstyled">
                {this.renderItems()}
            </ul>;
        },

        renderItems: function () {
            return this.state.items.map(function (item, i) {
                var key = item.key;

                if (!key) {
                    throw new Error('SortableItem items must have a key!');
                }

                var classes = classSet({
                    'dnd__item--placeholder': this.state.placeholder === i
                });

                return <li
                    draggable
                    className={classes}
                    onDragStart={this.handleDragStart.bind(this, i)}
                    onDragEnd={this.handleDragEnd.bind(this, i)}
                    onDragOver={this.handleDragOver.bind(this, i)}
                    key={key}>
                    {this.props.renderItem(item)}
                </li>;
            }.bind(this));
        },

        handleDragStart: function (i) {
            this.setState({
                dragged: i,
                placeholder: i
            });
        },

        handleDragEnd: function () {
            this.setState({
                dragged: -1,
                placeholder: -1
            });

            this.props.onSort(this.state.items);
        },

        handleDragOver: function (i, e) {
            // Allows us to drop
            e.preventDefault();

            var dragged = this.state.dragged;
            var items = this.swapItems(dragged, i, true);

            this.setState({
                placeholder: i,
                dragged: i,
                items: items
            });
        },

        swapItems: function (a, b, inplace) {
            // Could copy, but doesn't matter.
            var items = inplace ? this.state.items : this.state.items.slice(0);

            if (a < 0 || b < 0) {
                console.warn('invalid state');
                return items;
            }

            var tmp = items[a];
            items[a] = items[b];
            items[b] = tmp;

            return items;
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
        renderTweet: function (tweet) {
            return <CMTweet tweet={tweet} />;
        },
        render: function () {
            if (!this.props.timeline) {
                return <div></div>;
            } else {
                return (
                    <section className="center-block dim-half-width">
                        <h2>Step 2: Reorder your Tweets</h2>
                        <SortableList
                            items={this.props.tweets}
                            renderItem={this.renderTweet}
                            onSort={this.props.onSort}>
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
