/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var Sortable = window.Sortable = require('Sortable');
    var client = require('api').getDefaultInstance();
    var mediator = require('mediator');


    var CMLoginButton = require('jsx!scripts/components/login_button.jsx?jsx');
    var CMSelectCTLStep = require('jsx!scripts/components/select_ctl_step.jsx?jsx');

    var CTL_RE = /^https?:\/\/twitter.com\/[^\/]+\/timelines\/(\d+)$/i;

    var SortableList = React.createClass({
        render: function () {
            return <ul className="list-unstyled">
                {this.renderPlaceholders()}
            </ul>;
        },
        componentDidMount: function () {
            this.renderItems();
            new Sortable(this.getDOMNode());
        },
        componentDidUpdate: function () {
        },
        renderItems: function () {
            this.props.children.forEach(function (child) {
                React.renderComponent(child,
                                      this.refs[child.props.key].getDOMNode());
            }.bind(this));
        },
        renderPlaceholders: function () {
            return this.props.children.map(function (child) {
                if (!child.props.key) {
                    throw new Error('SortableItem children must have a key!');
                }
                return <li key={child.props.key} ref={child.props.key} />;
            });
        },
        componentWillUnmount: function () {
            this.props.children.forEach(function (child) {
                React.unmountAndReleaseReactRootNode(
                    this.refs[child.props.key].getDOMNode());
            });
        }
    });

    var CMTweet = React.createClass({
        render: function () {
            // Make sure to follow display guidelines here.
            return <div className="draggable">
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
