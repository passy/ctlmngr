define(function (require) {
    'use strict';
    var React = require('react');

    return React.createClass({
        displayName: 'Tweet',

        render: function () {
            var tweet = this.props.tweet;

            /*jshint camelcase:false */
            return <article className="tweet media">
                <header className="tweet__header">
                    <a className="media" target="_blank" href={'https://twitter.com/' + tweet.user.screen_name} rel="author">
                        <img className="pull-left tweet__avatar" src={tweet.user.profile_image_url_https} alt={'@' + tweet.user.screen_name + ' Avatar'} />
                        <b className="fullname">{tweet.user.name}</b>
                        <time className="tweet__time pull-right" dateTime={tweet.created_at}>
                            {tweet.created_at}
                        </time>
                        <span className="screenname">
                            <span className="at">@</span>
                            {tweet.user.screen_name}
                        </span>
                    </a>
                </header>
                <blockquote className="media-body">{tweet.text}</blockquote>
                <footer className="tweet__actions">
                    <a href={'https://twitter.com/intent/user?screen_name=' + tweet.user.screen_name}
                        target="_blank">
                        <i className="icon icon--follow" title="Follow" />
                    </a>
                    <a href={'https://twitter.com/intent/tweet?in_reply_to=' + tweet.id_str}
                        target="_blank">
                        <i className="icon icon--reply" title="Reply" />
                    </a>
                    <a href={'https://twitter.com/intent/retweet?tweet_id=' + tweet.id_str}
                        target="_blank">
                        <i className="icon icon--retweet" title="Retweet" />
                    </a>
                    <a href={'https://twitter.com/intent/favorite?tweet_id=' + tweet.id_str}
                        target="_blank">
                        <i className="icon icon--favorite" title="Favorite" />
                    </a>
                </footer>
            </article>;
        }
    });
});
