(function (require) {
    'use strict';

    require.config({
        baseUrl: 'scripts/',
        paths: {
            'JSXTransformer': '../bower_components/react/JSXTransformer',
            'jsx': '../bower_components/require-jsx/jsx',
            'react': '../bower_components/react/react-with-addons',
        }
    });

    require(['jsx!./bootstrap'], function (bootstrap) {
        bootstrap(document.querySelector('.js-cm-app'));
    });
}(window.require));
