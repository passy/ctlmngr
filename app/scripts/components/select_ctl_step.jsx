/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var mediator = require('mediator');
    var CMCTLList = require('jsx!scripts/components/ctl_list.jsx?jsx');
    var CTL_RE = /^https?:\/\/twitter.com\/[^\/]+\/timelines\/(\d+)$/i;

    return React.createClass({
        componentDidMount: function () {
            var that = this;

            mediator.subscribe('dataResolveCTL', function (data) {
                that.handleResolve(data.ctl);
            });
        },

        handleSubmit: function (e) {
            e.preventDefault();

            var url = this.refs.url.getDOMNode().value.trim();
            this.resolveCTL(url);
        },

        handleSelect: function (ctlKey) {
            mediator.publish('uiResolveCTL', {
                id: ctlKey
            });
        },

        handleResolve: function (ctl) {
            this.props.onSelect(ctl);
        },

        resolveCTL: function (url) {
            var matches = url.match(CTL_RE);
            var id = (matches || [])[1];

            if (!id) {
                // TODO
                var msg = 'Invalid URL. I should better handle this error ...';
                alert(msg);
                throw new Error(msg);
            }

            mediator.publish('uiResolveCTL', {
                id: id
            });
        },

        render: function () {
            return (
                <section className="clearfix">
                    <form className="center-block dim-half-width" onSubmit={this.handleSubmit}>
                        <h2>Step 1: Select a Custom Tineline</h2>
                        <div className="input-group">
                            <input ref="url" className="form-control" type="url" placeholder="Enter a Custom Timeline URL" />
                            <span className="input-group-btn">
                                <button className="btn btn-default" type="submit">Go!</button>
                            </span>
                        </div>
                        <div className="l-marg-t-n">
                            <CMCTLList timelines={this.props.timelines} onSelect={this.handleSelect} />
                        </div>
                    </form>
                </section>
            );
        }
    });
})
