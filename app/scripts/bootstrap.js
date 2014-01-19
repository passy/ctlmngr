/** @jsx React.DOM */
/* global React */

define(function (require) {
    'use strict';

    var React = require('react');

    var CMApp = React.createClass({
        handleSubmit: function (e) {
            e.preventDefault();
            console.log('Submitted.', e);
        },
        render: function () {
            return (
                <form className="center-block dim-half-width" onSubmit={this.handleSubmit}>
                    <div className="input-group">
                        <input className="form-control" type="url" placeholder="Custom Timeline URL" />
                        <span className="input-group-btn">
                            <button className="btn btn-default" type="submit">Go!</button>
                        </span>
                    </div>
                </form>
            );
        }
    });

    return function bootstrap(node) {
        React.renderComponent(<CMApp />, node);
    };
});
