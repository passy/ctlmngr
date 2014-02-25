/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');

    return React.createClass({
        displayName: 'ProgressBar',

        render: function () {
            var perc = ~~(this.props.value /
                          (this.props.max - this.props.min) * 100) + '%';

            return <div className="progress progress-striped active">
                <div className="progress-bar" role="progressbar"
                    aria-valuenow={this.props.value}
                    aria-valuemin={this.props.min}
                    aria-valuemax={this.props.max}
                    style={{ width: perc }}>
                    <span className="sr-only">{perc + ' complete'}</span>
                </div>
            </div>;
        }
    });
});
