/** @jsx React.DOM */
/* global React */

(function (window, React) {
    'use strict';

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
    React.renderComponent(<CMApp />, document.querySelector('.js-cm-app'));
}(this, React));
