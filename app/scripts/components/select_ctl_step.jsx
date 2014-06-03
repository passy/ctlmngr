/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var CMCTLList = require('jsx!components/ctl_list');
    var TwbsModal = require('jsx!components/twbs_modal');
    var ctlResolver = require('ctl_resolver');

    return React.createClass({
        displayName: 'CMSelectCTLStep',

        getInitialState: function () {
            return {
                error: null
            };
        },

        handleSubmit: function (e) {
            e.preventDefault();

            var url = this.refs.url.getDOMNode().value.trim();

            ctlResolver.resolveURL(url).then(
                this.props.onSelect,
                function (e) {
                    this.setState({
                        error: e
                    });
                }.bind(this)
            );
        },

        handleSelect: function (ctlKey/*, ctl */) {
            this.props.onSelect(ctlKey);
        },

        renderErrorModal: function () {
            if (!this.state.error) {
                return <span />;
            }

            var dismiss = function () {
                this.setState({
                    error: null
                });
            }.bind(this);

            return <TwbsModal onRequestClose={dismiss}
                title="Invalid Collection Requested">
                Could not resolve Collection.<br />
                <strong>{this.state.error.message}</strong>
            </TwbsModal>;
        },

        render: function () {
            return (
                <section className="clearfix center-block dim-half-width">
                    <div className="panel panel-primary">
                    <header className="panel-heading"><span className="rounded-number l-marg-r-s">1</span> Select a Collection</header>

                    <form className="l-marg-a-n" onSubmit={this.handleSubmit}>
                        {this.renderErrorModal()}
                        <div className="input-group">
                            <input ref="url" className="form-control" type="url" placeholder="Enter a Collection URL" />
                            <span className="input-group-btn">
                                <button className="btn btn-default" type="submit">Go!</button>
                            </span>
                        </div>
                        <div className="l-marg-t-n">
                            <CMCTLList
                                timelines={this.props.timelines}
                                selected={this.props.timeline}
                                onSelect={this.handleSelect} />
                        </div>
                    </form>
                    </div>
                </section>
            );
        }
    });
});
