/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var classSet = React.addons.classSet;

    return React.createClass({
        displayName: 'SortableList',

        getInitialState: function () {
            return {
                dragged: -1,
                placeholder: -1,
                // I initially just relied on the upstream component reacting to
                // onSort and updating the array before I realized that this is
                // a horrible idea because it breaks the isolation of the
                // component. You want the list to be sortable no matter what
                // the outer component does.
                items: this.props.items
            };
        },

        componentWillReceiveProps: function (props) {
            // Props take precedence state for items.
            this.setState({
                items: props.items
            });
        },

        render: function () {
            return <ul className="list-unstyled">
                {this.renderItems()}
            </ul>;
        },

        renderItems: function () {
            return this.state.items.map(function (item, i) {
                var key = item.key;

                if (!key) {
                    throw new Error('SortableItem items must have a key!');
                }

                var classes = classSet({
                    'dnd__item--placeholder': this.state.placeholder === i
                });

                return <li
                    draggable
                    className={classes}
                    onDragStart={this.handleDragStart.bind(this, i)}
                    onDragEnd={this.handleDragEnd.bind(this, i)}
                    onDragOver={this.handleDragOver.bind(this, i)}
                    key={key}>
                    {this.props.renderItem(item)}
                </li>;
            }.bind(this));
        },

        handleDragStart: function (i) {
            this.setState({
                dragged: i,
                placeholder: i
            });
        },

        handleDragEnd: function () {
            this.setState({
                dragged: -1,
                placeholder: -1
            });

            this.props.onSort(this.state.items);
        },

        handleDragOver: function (i, e) {
            // Allows us to drop
            e.preventDefault();

            var dragged = this.state.dragged;
            var items = this.swapItems(dragged, i, true);

            this.setState({
                placeholder: i,
                dragged: i,
                items: items
            });
        },

        swapItems: function (a, b, inplace) {
            // Could copy, but doesn't matter.
            var items = inplace ? this.state.items : this.state.items.slice(0);

            if (a < 0 || b < 0) {
                console.warn('invalid state');
                return items;
            }

            var tmp = items[a];
            items[a] = items[b];
            items[b] = tmp;

            return items;
        }
    });
});
