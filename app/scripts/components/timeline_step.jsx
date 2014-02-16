/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var SortableList = require('jsx!scripts/components/sortable_list.jsx?jsx');
    var Spinner = require('jsx!scripts/components/spinner.jsx?jsx');
    var CMTweet = require('jsx!scripts/components/tweet.jsx?jsx');

    return React.createClass({
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
                            <span className="rounded-number">2</span>
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
