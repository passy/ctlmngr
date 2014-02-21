'use strict';

var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config');


gulp.task('serve', function () {
    var config = Object.create(webpackConfig);

    config.devtool = 'eval';
    config.debug = true;

    new WebpackDevServer(webpack(config), {
        contentBase: 'app',
        publicPath: config.output.publicPath,
        hot: true
    }).listen(9000, '0.0.0.0', function (err) {
        if (err) {
            throw new gulpUtil.PluginError('webpack-dev-server', err);
        }

        gulpUtil.log('[webpack-dev-server]',
                     'http://localhost:9000/webpack-dev-server/index.html');
    });
});
