'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var gutil = require('gulp-util');


gulp.task('styles', function () {
    return gulp.src('app/styles/main.css')
        .pipe($.minifyCss({
            root: 'app/'
        }))
        .pipe($.cache($.autoprefixer('last 1 version')))
        .pipe($.rename('main.css'))
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

gulp.task('clean', function () {
    return gulp.src(['app/bundle', 'dist/', '.tmp'], { read: false })
        .pipe($.clean());
});

gulp.task('copy-assets', function () {
    return gulp.src(['app/*.{html,ico,txt}', 'fonts/'])
        .pipe(gulp.dest('dist/'));
});

gulp.task('connect', $.connect.server({
    root: ['app'],
    port: 9000,
    livereload: true
}));

var jsxReplace = $.replace(/require\('jsx!/g, 'require(\'');

gulp.task('scripts-precompile', function () {
    return gulp.src('app/scripts/**/*.jsx')
        .pipe($.react())
        .pipe(jsxReplace)
        .pipe(gulp.dest('.tmp/scripts/'));
});

gulp.task('scripts-copy', function () {
    return gulp.src('app/scripts/**/*.{js,json}')
        .pipe(jsxReplace)
        .pipe(gulp.dest('.tmp/scripts/'));
});

gulp.task('scripts-bower', function () {
    return gulp.src('app/bower_components/**')
        .pipe(gulp.dest('.tmp/bower_components'));
});

gulp.task('scripts', ['scripts-bower', 'scripts-precompile', 'scripts-copy'], function () {
    $.requirejs({
        baseUrl: '.tmp/scripts/',
        name: 'main',
        mainConfigFile: '.tmp/scripts/main.js',
        out: 'main.js'
    })
    .pipe($.uglify({ outSourcemap: true }))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('watch', ['connect'], function () {
    // Watch for changes in `app` folder
    gulp.watch([
        'app/*.html',
        'app/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*'
    ], $.connect.reload);
});

gulp.task('build', ['clean', 'styles', 'images', 'copy-assets', 'scripts']);

gulp.task('default', ['build']);
