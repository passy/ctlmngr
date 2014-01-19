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
        }
    });

    require(['bootstrap'], function (bootstrap) {
        bootstrap(document.querySelector('.js-cm-app'));
    });
}(window.require));
