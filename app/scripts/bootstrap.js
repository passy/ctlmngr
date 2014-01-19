define(function (require) {
    'use strict';

    var React = require('react');

    var API = require('api');
    var CMApp = require('jsx!scripts/components/app.jsx?jsx');

    var client = API.getDefaultInstance();
    var cmApp = new CMApp();

    var userSession;

    function start() {
        return client.getSession().then(function (session) {
            userSession = session;
            cmApp.setSession(session);
        }, function (e) {
            if (e.status === 403) {
                cmApp.setSession(null);
            } else {
                throw e;
            }
        });
    }

    function loadCTLs() {
        client.getCTLs({
            userId: userSession.user_id,
            includeCards: true,
            includeEntities: true,
            sendErrorCodes: true,
        }).then(function (response) {
            var timelines = (response && response.objects.timelines) || {};
            cmApp.setTimelines(timelines);
        });
    }

    return function bootstrap(node) {
        start().then(loadCTLs).done();
        React.renderComponent(cmApp, node);
    };
});
