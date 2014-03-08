/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var cx = React.addons.classSet;

    return React.createClass({
        displayName: 'CMTimelineOptionsDropdown',

        propTypes: {
            onSortRequested: React.PropTypes.func.isRequired
        },

        getInitialState: function () {
            return {
                open: false,
                sortDirection: 'asc'
            };
        },

        toggleSortState: function () {
            this.setState({
                sortDirection: this.state.sortDirection === 'asc' ? 'desc' : 'asc'
            });
        },

        handleToggleOpen: function () {
            this.setState({
                open: !this.state.open
            });
        },

        handleSortRequest: function (e) {
            e.preventDefault();
            this.props.onSortRequested(this.state.sortDirection);
            this.toggleSortState();
        },

        render: function () {
            var dropdownCx = cx({
                dropdown: true,
                open: this.state.open,
                'pull-right': true
            });

            var menuCx = cx({
                'dropdown-menu': true,
                'anim-roll-down': this.state.open
            });

            return (
                <div className={dropdownCx}>
                    <button onClick={this.handleToggleOpen}
                        className="btn btn-transparent btn-xs dropdown-toggle"
                        type="button">
                        &hellip;
                    </button>
                    <ul className={menuCx} role="menu">
                        <li role="presentation">
                            <a role="menuitem" onClick={this.handleSortRequest} href="#">
                                Sort by Time ({this.state.sortDirection})
                            </a>
                        </li>
                    </ul>
                </div>
            );
        }
    });
});
