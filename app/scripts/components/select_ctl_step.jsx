/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var CMCTLList = require('jsx!scripts/components/ctl_list.jsx?jsx');
    var ctlResolver = require('ctl_resolver');

    return React.createClass({
        handleSubmit: function (e) {
            e.preventDefault();

            var url = this.refs.url.getDOMNode().value.trim();

            ctlResolver.resolveURL(url).then(
                this.props.onSelect.bind(this),
                function (e) {
                    // TODO: Alert box modal anyone?
                    window.alert('Invalid CTL: ' + e);
                }
            );
        },

        handleSelect: function (ctlKey/*, ctl */) {
            this.props.onSelect(ctlKey);
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
