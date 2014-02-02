/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var SortableList = require('jsx!scripts/components/sortable_list.jsx?jsx');

    var CMTweet = React.createClass({
        render: function () {
            // Make sure to follow display guidelines here.
            return <div>
                <blockquote>{this.props.tweet.text}</blockquote>
            </div>;
        }
    });

    return React.createClass({
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
});
