define(function (require) {
    'use strict';

    var React = require('react');

    var API = require('api');
    var CMApp = require('jsx!scripts/components/app.jsx?jsx');
    var DataBridge = require('data_bridge');
    var mediator = require('mediator');

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
        if (!userSession) {
            return;
        }

        window.api = client;
        /*jshint camelcase:false */
        client.getCTLs({
            userId: userSession.user_id,
            sendErrorCodes: true
        }).then(function (response) {
            var timelines = (response && response.objects.timelines) || {};
            cmApp.setTimelines(timelines);
        });
    }

    return function bootstrap(node, options) {
        var dataBridge = new DataBridge(mediator);
        options = options || {};
        dataBridge.listen();

        start().then(loadCTLs).done();
        React.renderComponent(cmApp, node);

        mediator.subscribe('dataError', function (e) {
            console.error('Data error:', e);
            try {
                window.alert('Data Error: ' + JSON.stringify(e));
            } catch (e) {
                window.alert('Unrecoverable data error.');
            }
        });
    };
});
