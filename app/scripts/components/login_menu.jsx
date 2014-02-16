define(function (require) {
    'use strict';

    var React = require('react');
    var withLayers = require('components/with_layers');
    var withMediator = require('components/with_mediator');
    var mediator = require('mediator');

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
        mixins: [withMediator(mediator), withLayers($endpoint)],

        propTypes: {
            session: React.PropTypes.object
        },

        handleLogin: function (e) {
            e.preventDefault();

            this.trigger('uiLogin');
        },

        handleLogout: function (e) {
            e.preventDefault();

            this.trigger('uiLogout');
        },

        renderLayer: function () {
            if (!this.props.session) {
                return <a href="#" onClick={this.handleLogin}>Log in with Twitter</a>;
            }
            return (<div>
                <a href="#" className="navbar-item dropdown-toggle">
                    <img
                        className="user-avatar hover-zoom img-rounded l-marg-r-s"
                        src="https://pbs.twimg.com/profile_images/378800000537335374/78d58d698fc464e16d1d7e7314962118_bigger.jpeg"
                        alt="Avatar" />
                    <span>@horse_medium</span>
                    <b className="caret"></b>
                </a>
                <ul className="dropdown-menu">
                    <li><a href="#" onClick={this.handleLogout}>Logout</a></li>
                </ul>
            </div>);
        },

        render: function () {
            return <span />;
        }
    });
});
