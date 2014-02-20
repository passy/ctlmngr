/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var _ = require('lodash');
    var mediator = require('mediator');
    var React = require('react');
    var WithMediator = require('components/with_mediator');
    var TwbsModal = require('jsx!scripts/components/twbs_modal.jsx?jsx');
    var ProgressBar = require('jsx!scripts/components/progress_bar.jsx?jsx');

    var classSet = React.addons.classSet;

    return React.createClass({
        displayName: 'CMSaveStep',

        mixins: [WithMediator(mediator)],

        getInitialState: function () {
            return {
                saving: null,
                error: null
            };
        },

        componentDidMount: function () {
            this.on('dataCreateCTL', this.handleCTLCreated);
            // For now.
            this.on('dataOverwriteCTL', this.handleCTLCreated);
            this.on('dataCreateCTLProgress', this.handleCTLProgress);
            this.on('dataOverwriteCTLProgress', this.handleCTLProgress);
            this.on('dataError', this.handleDataError, { priority: 0 });
        },

        handleSubmit: function (e) {
            e.preventDefault();
            var saveType = this.refs.form.getDOMNode().saveType.value;

            /*jshint camelcase:false */
            this.trigger(saveType === 'overwrite' ? 'uiOverwriteCTL' : 'uiCreateCTL', {
                id: this.props.timeline.id,
                name: this.refs.name.getDOMNode().value,
                description: 'Automatically created by ctlmngr',
                tweetIds: this.props.tweets.map(function (x) { return x.id_str; })
            });

            this.setState({
                saving: { value: 0, total: -1 }
            });
        },

        handleCTLCreated: function () {
            // TODO: Improve?
            // Should refresh the timelines list.

            this.setState({
                saving: null
            });
            window.alert('CTL created. Better check TweetDeck if this actually worked.');
        },

        handleCTLProgress: function (data) {
            this.setState({
                saving: _.assign(this.state.saving, data)
            });
        },

        handleDataError: function (data, channel) {
            channel.stopPropagation();

            console.log('Setting error state.');
            this.setState({
                error: data
            });
        },

        renderProgress: function () {
            if (!this.state.saving) {
                // XXX: Is there a better pattern for this?
                return <div />;
            }

            return <ProgressBar className="l-marg-v-n"
                min="0"
                max={this.state.saving.total}
                value={this.state.saving.value} />;
        },

        renderErrorModal: function () {
            var handleDismiss = function () {
                this.setState({
                    error: null,
                    saving: null
                });
            }.bind(this);

            if (!this.state.error) {
                return <span />;
            }

            return <TwbsModal
                title="Shit went haywire"
                onRequestClose={handleDismiss}>
                <strong>Status:</strong> {this.state.error.status}<br />
                <strong>Message:</strong> {this.state.error.message}
            </TwbsModal>;
        },

        render: function () {
            // TODO: Description and option to overwrite existing
            if (_.isEmpty(this.props.timeline)) {
                return <div />;
            }

            var innerFormClasses = classSet({
                's-disabled': this.state.saving
            });

            return (
                <section className="clearfix center-block dim-half-width">
                    <div className="panel panel-primary">
                        <header className="panel-heading"><span className="rounded-number l-marg-r-s">3</span> Save your Custom Timeline</header>
                        <form className="l-marg-a-n" ref="form" onSubmit={this.handleSubmit}>
                            {this.renderProgress()}
                            {this.renderErrorModal()}
                            <div className={innerFormClasses}>
                            <div className="input-group l-marg-b-n">
                                <label className="radio-inline">
                                    <input name="saveType" type="radio" value="create" defaultChecked />Create New
                                </label>
                                <label className="radio-inline">
                                    <input name="saveType" type="radio" value="overwrite" />Overwrite
                                </label>
                            </div>
                            <div className="input-group">
                                <input ref="name"
                                    className="form-control"
                                    type="text"
                                    maxLength="25"
                                    placeholder="Name of your new Timeline"
                                    defaultValue={this.props.timeline.name} />
                                <span className="input-group-btn">
                                    <button className="btn btn-default" type="submit">Save</button>
                                </span>
                            </div>
                            </div>
                        </form>
                    </div>
                </section>
            );
        }
    });

});
