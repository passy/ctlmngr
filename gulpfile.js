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
    return gulp.src(['app/bundle', 'dist/'], { read: false })
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

gulp.task('watch', ['connect'], function () {
    // Watch for changes in `app` folder
    gulp.watch([
        'app/*.html',
        'app/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*'
    ], $.connect.reload);
});

gulp.task('build', ['clean', 'styles', 'images', 'copy-assets']);

gulp.task('default', ['build']);
