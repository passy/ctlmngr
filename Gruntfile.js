// Generated on 2014-01-19 using generator-webapp-assetgraph 0.0.0
'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // Configurable paths
            app: 'app',
            dist: 'dist',
            test: 'test'
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= yeoman.dist %>',
                        '.tmp'
                    ]
                }]
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },

            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '{,*/}*.css',
                    dest: '.tmp/'
                }]
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                '<%= yeoman.test %>/spec/{,*/}*.js'
            ]
        },

        reduce: {
            // Source folder
            root: '.tmp',

            // Build destination folder
            outRoot: '<%= yeoman.dist %>',

            // Root of your CDN. Optional
            //cdnRoot: 'https://my.amazon.s3.bucket',

            // minimatch patterns of files to include as base assets
            // Dependencies of these will be automatically populated
            // Paths are relative to reduce.root
            include: [
                '**/*.html',
                '**/.htaccess',
                '*.txt',
                '*.ico'
            ],

            // Compile less files and remove less.js from application
            less: true,

            // Run all available jpeg and png optimizations on images
            // For maximum efficiency install jpegtran, optipng, pngcrush and pngquant
            optimizeImages: true,

            // Create a cache manifest file
            // If one already exists it will be ammended with static assets
            manifest: true,

            // Set the 'async'-attribute on all script tags
            asyncScripts: true,

            // Pretty print assets. Good for debugging
            pretty: false, // Default: false

            // Inline CSS backgrounds below this byte threshold as data-uris
            // There will be an old IE fallback to the original image
            // 0 disables.
            inlineSize: 4096
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            }
        },
        watch: {
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/{,**/}*.html',
                    '.tmp/{,**/}*.{css}',
                ]
            },
            css: {
                files: [
                    '<%= yeoman.app %>/{,**/}*.css',
                ],
                tasks: ['autoprefixer']
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '.tmp',
                    src: [
                        '{,**/}*'
                    ]
                }]
            }
        }
    });

    grunt.registerTask('build', [
        'clean:dist',
        'copy:dist',
        'autoprefixer',
        'reduce'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'build'
    ]);

    grunt.registerTask('serve', [
        'clean:dist',
        'autoprefixer',
        'connect:livereload',
        'watch'
    ]);
};
