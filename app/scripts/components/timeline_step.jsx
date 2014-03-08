/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var SortableList = require('jsx!components/sortable_list');
    var Spinner = require('jsx!components/spinner');
    var CMTweet = require('jsx!components/tweet');
    var CMTimelineOptionsDropdown = require('jsx!components/timeline_options_dropdown');

    return React.createClass({
        displayName: 'CMTimelineStep',

        renderTweet: function (tweet) {
            return <CMTweet tweet={tweet} />;
        },

        handleFullSortRequested: function (direction) {
            var sortFn = function (a, b) {
                /*jshint camelcase:false */
                var dateA = new Date(a.created_at);
                var dateB = new Date(b.created_at);

                return direction === 'asc' ? dateA > dateB : dateA < dateB;
            };

            this.props.onSort(
                this.props.tweets.slice(0).sort(sortFn)
            );
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
                            <CMTimelineOptionsDropdown
                                onSortRequested={this.handleFullSortRequested}
                            />
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
