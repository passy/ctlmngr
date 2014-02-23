'use strict';

var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config');

gulp.task('build', function (cb) {
    var config = Object.create(webpackConfig);

    config.plugins = (config.plugins || []).concat(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    );

    webpack(config, function (err, stats) {
        if (err) {
            throw new gulpUtil.PluginError('webpack-build', err);
        }

        gulpUtil.log('[webpack-build]', stats.toString({
            colors: true
        }));

        cb();
    });
});

gulp.task('build-dev', function (cb) {
    var config = Object.create(webpackConfig);

    config.devtool = 'eval';
    config.debug = true;

    webpack(config, function (err, stats) {
        if (err) {
            throw new gulpUtil.PluginError('webpack-build-dev', err);
        }

        gulpUtil.log('[webpack-build-dev]', stats.toString({
            colors: true
        }));

        cb();
    });
});

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

gulp.task('default', ['build']);
