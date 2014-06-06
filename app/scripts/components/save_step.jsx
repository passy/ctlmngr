/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var _ = require('lodash');
    var mediator = require('mediator');
    var React = require('react');
    var WithMediator = require('components/with_mediator');
    var TwbsModal = require('jsx!components/twbs_modal');
    var ProgressBar = require('jsx!components/progress_bar');

    var classSet = React.addons.classSet;

    return React.createClass({
        displayName: 'CMSaveStep',

        mixins: [WithMediator(mediator)],

        getInitialState: function () {
            return {
                saving: null,
                error: null,
                success: null
            };
        },

        componentDidMount: function () {
            this.on('dataCreateCTL', this.handleCTLSavedDecorator(
                this.handleCTLCreated));
            this.on('dataOverwriteCTL', this.handleCTLSavedDecorator(
                this.handleCTLOverwritten));
            this.on('dataCreateCTLProgress', this.handleCTLProgress);
            this.on('dataOverwriteCTLProgress', this.handleCTLProgress);
            this.on('dataError', this.handleDataError, { priority: 0 });
        },

        getSaveTypeValue: function () {
            return Array.prototype.slice.call(
                this.refs.form.getDOMNode().saveType)
            .reduce(function (a, b) {
                if (b.checked) {
                    return b.value;
                }
            });
        },

        handleSubmit: function (e) {
            e.preventDefault();

            /*jshint camelcase:false */
            var saveType = this.getSaveTypeValue();
            this.trigger(saveType === 'overwrite' ? 'uiOverwriteCTL' : 'uiCreateCTL', {
                id: this.props.timeline.id,
                name: this.refs.name.getDOMNode().value,
                tweetIds: this.props.tweets.map(function (x) { return x.id_str; })
            });

            this.setState({
                saving: { value: 0, total: -1 }
            });
        },

        handleCTLSavedDecorator: function (fn) {
            return _.compose(function () {
                this.setState({
                    saving: null
                });
                this.trigger('uiRefreshCTLs', {
                    /*jshint camelcase:false */
                    userId: this.props.session.user_id
                });
            }.bind(this), fn);
        },

        handleCTLOverwritten: function () {
            this.setState({
                success: {
                    // By definition, we keep the same URL.
                    /*jshint camelcase:false */
                    url: this.props.timeline.custom_timeline_url
                }
            });
        },

        handleCTLCreated: function (data) {
            // Sorry for this ...
            var url = _.pluck(_.first(_.pairs(data.response.objects.timelines)),
                              'custom_timeline_url')[1];
            this.setState({
                success: {
                    url: url
                }
            });
        },

        handleCTLProgress: function (data) {
            this.setState({
                saving: _.assign(this.state.saving, data)
            });
        },

        handleDataError: function (data, channel) {
            channel.stopPropagation();

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

        renderSuccessModal: function () {
            var handleDismiss = function () {
                this.setState({
                    success: null
                });
            }.bind(this);

            if (!this.state.success) {
                return <span />;
            }

            return <TwbsModal
                title="Your CTL is ready to rock!"
                onRequestClose={handleDismiss}>
                Your Collection has been saved. You can see the result here:<br />
                <a href={this.state.success.url}>{this.state.success.url}</a>
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
                        <header className="panel-heading"><span className="rounded-number l-marg-r-s">3</span> Save your Collection</header>
                        <form className="l-marg-a-n" ref="form" onSubmit={this.handleSubmit}>
                            {this.renderProgress()}
                            {this.renderErrorModal()}
                            {this.renderSuccessModal()}
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
