/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var mediator = require('mediator');
    var CMCTLList = require('jsx!scripts/components/ctl_list.jsx?jsx');
    var WithMediator = require('components/with_mediator');
    var ctlResolver = require('ctl_resolver');

    return React.createClass({
        mixins: [WithMediator(mediator)],

        componentDidMount: function () {
            this.on('dataResolveCTL', this.handleResolve);
        },

        handleSubmit: function (e) {
            e.preventDefault();

            var url = this.refs.url.getDOMNode().value.trim();
            this.resolveCTL(url);
        },

        handleSelect: function (ctlKey) {
            this.trigger('uiResolveCTL', {
                id: ctlKey
            });
        },

        handleResolve: function (ctlResponse) {
            this.props.onSelect(ctlResponse.ctl);
        },

        resolveCTL: function (url) {
            ctlResolver.resolveURL(url).then(function (id) {
                this.publish('uiResolveCTL', {
                    id: id
                });
            }, function (e) {
                // TODO: Alert box modal anyone?
                window.alert('Invalid CTL: ' + e);
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
});
