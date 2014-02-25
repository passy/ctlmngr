/** @jsx React.DOM */
define(function (require) {
    'use strict';

    var React = require('react');
    var withLayers = require('components/with_layers');
    var withMediator = require('components/with_mediator');
    var mediator = require('mediator');
    var classSet = React.addons.classSet;

    // This is probably an utterly terrible idea, but I wanna see how this works
    // out. The point is that we need this outside of the DOM directly
    // controlled by React. An alternative idea would be to pass the target in
    // as a target. On the other hand, though, the component should in some way
    // be responsible for rendering correctly and by doing it like this I can
    // just pretend that this menu is part of the top-level App component. But
    // then, it breaks the encapsulation because I couldn't just render it into
    // a node for testing. THIS STUFF IS HARD!
    var $endpoint = document.querySelector('.js-cm-user-menu');

    return React.createClass({
        displayName: 'CMLoginMenu',

        mixins: [withMediator(mediator), withLayers($endpoint)],

        propTypes: {
            session: React.PropTypes.object
        },

        getInitialState: function () {
            return {
                open: false,
                avatar: 'https://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.png'
            };
        },

        componentDidMount: function () {
            /*jshint camelcase:false */
            this.on('dataUserInfo', function (data) {
                this.setState({
                    avatar: data.response.profile_image_url_https
                });
            }.bind(this), {
                predicate: function (d) {
                    return d.response.screen_name === this.props.session.screen_name;
                }.bind(this)
            });
        },

        componentWillReceiveProps: function (nextProps) {
            /*jshint camelcase:false */

            // In simple words: If we didn't have a previous session but now
            // have one OR we have a new one and the user changed, request user
            // information.
            if ((!this.props.session && nextProps.session) ||
                 (this.props.session && nextProps.session &&
                  nextProps.session.screen_name !==
                      this.props.session.screen_name)
               ) {
                this.trigger('uiUserInfo', {
                    id: nextProps.session.user_id
                });
            }
        },

        handleLogin: function (e) {
            e.preventDefault();

            this.trigger('uiLogin');
        },

        handleLogout: function (e) {
            e.preventDefault();

            this.trigger('uiLogout');
        },

        handleToggleDropdown: function (e) {
            e.preventDefault();

            this.setState({
                open: !this.state.open
            });
        },

        renderLayer: function () {
            if (!this.props.session) {
                return <li>
                    <a className="navbar-item" href="#" onClick={this.handleLogin}>Log in with Twitter</a>
                </li>;
            }

            var dropDownClasses = classSet({
                open: this.state.open,
                dropdown: true
            });

            /*jshint camelcase:false */
            return (<li className={dropDownClasses}>
                <a href="#" className="navbar-item dropdown-toggle" onClick={this.handleToggleDropdown}>
                    <img
                        className="user-avatar hover-zoom img-rounded l-marg-r-s"
                        src={this.state.avatar}
                        alt="Avatar" />
                    <span>@{this.props.session.screen_name}</span>
                    <b className="caret"></b>
                </a>
                <ul className="dropdown-menu">
                    <li>
                        <a href={'https://twitter.com/' + this.props.session.screen_name}
                        target="_blank">Twitter Profile</a>
                    </li>
                    <li><a href="#" onClick={this.handleLogout}>Logout</a></li>
                </ul>
            </li>);
        },

        render: function () {
            return <span />;
        }
    });
});
