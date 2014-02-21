'use strict';


module.exports = {
    debug: true,
    devtool: 'eval',
    context: __dirname + '/app',
    entry: './scripts/main.js',
    output: {
        path: __dirname + '/app',
        filename: 'bundle.js'
    },
    resolve: {
        modulesDirectories: ['app/bower_components', 'node_modules'],
        alias: {
            'lodash': __dirname + '/app/bower_components/lodash/dist/lodash',
            'react': __dirname + '/app/bower_components/react/react-with-addons',
        }
    },
    module: {
        loaders: [
            {test: /\.jsx$/, loader: 'jsx-loader'},
            {test: /\.json/, loader: 'json-loader'}
        ]
    }
};
