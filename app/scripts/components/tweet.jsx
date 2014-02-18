define(function (require) {
    'use strict';
    var React = require('react');

    return React.createClass({
        displayName: 'Tweet',

        render: function () {
            var tweet = this.props.tweet;

            /*jshint camelcase:false */
            return <article className="tweet">
                <header className="tweet__header">
                    <time className="tweet__time" dateTime={tweet.created_at}>
                        {tweet.created_at}
                    </time>
                    <a target="_blank" href={'https://twitter.com/' + tweet.user.screen_name} rel="author">
                        <div className="obj__left">
                            <img className="tweet__avatar" src={tweet.user.profile_image_url_https} alt={'@' + tweet.user.screen_name + ' Avatar'} />
                        </div>
                        <b className="fullname">{tweet.user.name}</b>
                        <span className="screenname">
                            <span className="at">@</span>
                            {tweet.user.screen_name}
                        </span>
                    </a>
                </header>
                <blockquote>{tweet.text}</blockquote>
                <footer className="tweet__actions">
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
