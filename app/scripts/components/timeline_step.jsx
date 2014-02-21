/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var SortableList = require('./sortable_list.jsx');
    var Spinner = require('./spinner.jsx');
    var CMTweet = require('./tweet.jsx');

    return React.createClass({
        displayName: 'CMTimelineStep',

        renderTweet: function (tweet) {
            return <CMTweet tweet={tweet} />;
        },

        render: function () {
            var loading = this.props.tweets.length === 0;
            if (this.props.timeline === null) {
                return <div />;
            }

            return (
                <section className="clearfix center-block dim-half-width">
                    <div className="panel panel-primary">
                        <header className="panel-heading">
                            <span className="rounded-number l-marg-r-s">2</span>
                            Reorder your Tweets
                        </header>
                        <div className="l-marg-a-n">
                            <Spinner loading={loading}>
                                <SortableList
                                    items={this.props.tweets}
                                    renderItem={this.renderTweet}
                                    onSort={this.props.onSort}>
                                </SortableList>
                            </Spinner>
                        </div>
                    </div>
                </section>
            );
        }
    });
});
