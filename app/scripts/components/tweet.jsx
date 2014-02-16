define(function (require) {
    'use strict';
    var React = require('react');

    return React.createClass({
        render: function () {
            var tweet = this.props.tweet;

            /*jshint camelcase:false */
            return <article className="tweet">
                <header className="tweet__header" style={{display: 'none'}}>
                    <time className="tweet__time" datetime={this.props.tweet.created_at}>
                        {this.props.tweet.created_at}
                    </time>
                    <a target="_blank" href={'https://twitter.com/' + tweet.user.screen_name}>
                        {tweet.user.name}
                    </a>
                </header>
                <blockquote>{this.props.tweet.text}</blockquote>
            </article>;
        }
    });
});
