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
            {test: /\.css$/, loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 1 version'},
            {test: /\.png$/, loader: 'url-loader?limit=100000&mimetype=image/png'},
            {test: /\.jpg$/, loader: 'file-loader'},
            {test: /\.woff$/, loader: 'url-loader?limit=100000&mimetype=application/font-woff'},
            {test: /\.ttf$/, loader: 'file-loader?mimetype=application/x-font-ttf'},
            {test: /\.eot$/, loader: 'file-loader?mimetype=application/vnd.ms-fontobject'},
            {test: /\.svg$/, loader: 'url-loader?limit=100000&mimetype=image/svg+xml'},
        ]
    }
};
