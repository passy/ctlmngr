'use strict';


module.exports = {
    context: __dirname + '/app',
    entry: './scripts/main.js',
    output: {
        path: __dirname + '/app/bundle',
        filename: 'bundle.js',
        publicPath: '/bundle/'
    },
    resolve: {
        modulesDirectories: ['bower_components', 'node_modules'],
        alias: {
            'lodash': __dirname + '/bower_components/lodash/dist/lodash',
            'react': __dirname + '/bower_components/react/react-with-addons',
        }
    },
    stats: {
        colors: true
    },
    module: {
        loaders: [
            {test: /\.jsx$/, loader: 'jsx-loader'},
            {test: /\.json$/, loader: 'json-loader'},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.png$/, loader: 'url-loader?limit=100000&mimetype=image/png'},
            {test: /\.jpg$/, loader: 'file-loader'},
            {test: /\.woff$/, loader: 'url-loader?limit=100000&mimetype=application/font-woff'},
            {test: /\.svg$/, loader: 'url-loader?limit=100000&mimetype=image/svg+xml'},
        ]
    }
};
