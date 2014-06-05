define(function (require) {
    'use strict';

    var React = require('react');

    var API = require('api');
    var CMApp = require('jsx!components/app');
    var DataBridge = require('data_bridge');
    var mediator = require('mediator');

    var client = API.getDefaultInstance();

    var userSession;

    function start(cmApp) {
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

    return function bootstrap(node) {
        var dataBridge = new DataBridge(mediator);
        var cmApp;

        dataBridge.listen();

        cmApp = React.renderComponent(new CMApp(), node);
        start(cmApp);

        mediator.subscribe('dataError', function (e) {
            console.error('Data error:', e);
            try {
                window.alert('Data Error: ' + JSON.stringify(e));
            } catch (e) {
                window.alert('Unrecoverable data error.');
            }
        }, {
            // Let this be very late in the chain so data error can be caught
            // upstream.
            priority: 100
        });
    };
});
