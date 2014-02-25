/** @jsx React.DOM */
define(function (require) {
    'use strict';
    var React = require('react');
    var classSet = React.addons.classSet;
    var WithLayers = require('components/with_layers');

    return React.createClass({
        displayName: 'TWBSModal',

        mixins: [WithLayers(document.body)],

        propTypes: {
            title: React.PropTypes.string.isRequired,
            onRequestClose: React.PropTypes.func.isRequired
        },

        getInitialState: function () {
            return {
                visible: false
            };
        },

        componentDidMount: function () {
            this.setState({
                visible: true
            });
        },

        handleDismiss: function () {
            // when you click the background or the dismiss buttons, the user is
            // requesting that the modal gets closed.  note that the modal has
            // no say over whether it actually gets closed. the owner of the
            // modal owns the state.  this just "asks" to be closed.
            this.props.onRequestClose();
        },

        renderButtons: function () {
            var renderPrimary = function () {
                if (this.props.primaryButton) {
                    return <button type="button" class="btn btn-primary">
                        {this.props.primaryButton}
                    </button>;
                } else {
                    return <span />;
                }
            }.bind(this);

            return <div>
                <button type="button" className="btn btn-default">Close</button>
                {renderPrimary()}
            </div>;
        },

        render: function () {
            // Rendering handled in layer
            return <span />;
        },

        renderLayer: function () {
            var modalClasses = classSet({
                modal: true,
                fade: true,
                in: this.state.visible,
                show: this.state.visible
            });

            var backdropClasses = classSet({
                'modal-backdrop': true,
                fade: true,
                in: this.state.visible
            });

            return (
                <div>
                <div className={backdropClasses}></div>
                <div className={modalClasses} onClick={this.handleDismiss}>
                    <div className="modal-dialog" onClick={this.killClick}>
                        <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" aria-hidden="true" onClick={this.handleDismiss}>&times;</button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        <div className="modal-footer">
                            {this.renderButtons()}
                        </div>
                        </div>
                    </div>
                </div>
                </div>
            );
        }
    });
});
