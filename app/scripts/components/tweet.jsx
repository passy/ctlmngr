/** @jsx React.DOM */
define(function (require) {
    'use strict';
    var React = require('react');
    var twttr = require('twitter-text');
    var LRU = require('simple-lru');

    // Totally arbitrary limit
    var tweetCache = new LRU(256);
    var WithPureRender = require('./with_pure_render');

    return React.createClass({
        displayName: 'Tweet',

        mixins: [WithPureRender],

        getTweetText: function () {
            /*jshint camelcase:false */
            var id = this.props.tweet.id_str;
            var body = tweetCache.get(id);

            if (!body) {
                body = twttr.txt.autoLinkWithJSON(
                    this.props.tweet.text,
                    this.props.tweet.entities);

                tweetCache.set(id, body);
            }

            return body;
        },

        renderBody: function () {
            return <div
                className="tweet__body"
                dangerouslySetInnerHTML={{__html: this.getTweetText()}}/>;
        },

        render: function () {
            var tweet = this.props.tweet;

            /*jshint camelcase:false */
            return <article className="tweet media l-marg-b-n">
                <header className="tweet__header l-marg-b-s">
                    <img className="tweet__avatar pull-left l-marg-r-n img-rounded"
                        src={tweet.user.profile_image_url_https}
                        alt={'@' + tweet.user.screen_name + ' Avatar'}
                        width="48"
                        height="48" />
                    <a className="media" target="_blank" href={'https://twitter.com/' + tweet.user.screen_name} rel="author">
                        <b className="fullname">{tweet.user.name}</b>
                        <small className="screenname text-muted l-marg-l-n">
                            <span className="at">@</span>
                            {tweet.user.screen_name}
                        </small>
                    </a>
                    <a href={'https://twitter.com/intent/user?screen_name=' + tweet.user.screen_name}
                        target="_blank"
                        className="tweet__main-action btn btn-primary btn-xs">
                        <i className="icon icon--follow" title="Follow" /> Follow
                    </a>
                </header>
                <div className="media-body">
                    {this.renderBody()}
                    <footer className="tweet__footer">
                        <a href={'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str}
                            target="_blank">
                            <time className="tweet__time text-muted small" dateTime={tweet.created_at}>
                                {tweet.created_at}
                            </time>
                        </a>
                        <div className="pull-right">
                            <a href={'https://twitter.com/intent/tweet?in_reply_to=' + tweet.id_str}
                                target="_blank"
                                className="tweet__action">
                                <i className="icon icon--reply" title="Reply" />
                            </a>
                            <a href={'https://twitter.com/intent/retweet?tweet_id=' + tweet.id_str}
                                target="_blank"
                                className="tweet__action">
                                <i className="icon icon--retweet" title="Retweet" />
                            </a>
                            <a href={'https://twitter.com/intent/favorite?tweet_id=' + tweet.id_str}
                                target="_blank"
                                className="tweet__action">
                                <i className="icon icon--favorite" title="Favorite" />
                            </a>
                        </div>
                    </footer>
                </div>
            </article>;
        }
    });
});
