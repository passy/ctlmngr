(function (require) {
    'use strict';

    require.config({
        baseUrl: 'scripts/',
        paths: {
            'JSXTransformer': '../bower_components/react/JSXTransformer',
            'jsx': '../bower_components/require-jsx/jsx',
            'text': '../bower_components/requirejs-text/text',
            'json': '../bower_components/requirejs-plugins/src/json',
            'react': '../bower_components/react/react-with-addons',
            'q': '../bower_components/q/q',
            'lodash': '../bower_components/lodash/dist/lodash',
            'underscore.string': '../bower_components/underscore.string/lib/underscore.string',
            'mediator-js': '../bower_components/mediator-js/lib/mediator',
            'Sortable': '../bower_components/Sortable/Sortable'
        }
    });

    require(['lodash', 'underscore.string'], function (_, _s) {
        _.string = _s;
    });

    require(['bootstrap'], function (bootstrap) {
        bootstrap(document.querySelector('.js-cm-app'));
    });
}(window.require));
