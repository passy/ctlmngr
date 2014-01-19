define(function (require) {
    'use strict';

    var React = require('react');

    var API = require('api');
    var Config = require('json!config.json');
    var CMApp = require('jsx!scripts/components/app.jsx?jsx');

    var client = new API(Config.API_BASE);
    var cmApp = new CMApp();

    client.getSession().then(function (session) {
        cmApp.setSession(session);
    }, function (e) {
        if (e.status === 403) {
            cmApp.setSession(null);
        } else {
            throw e;
        }
    }).done();

    return function bootstrap(node) {
        React.renderComponent(cmApp, node);
    };
});
