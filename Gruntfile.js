/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        /*
            Task configuration. Grunt tasks consist of global options, followed
            by per 'target' configuration. Targets can have abritary names, and
            I have organized them by their source hbs names
        */

        // Minifies CSS stylesheets
        cssmin: {

            // Global options. Per target options can also be defined.
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1,
                level: 2,
            },

            /*
                Begin list of targets:

                IMPORTANT: Always include fonts.css as the 2nd stylesheet,
                immediately after bootstrap.css. It is required by the logo
                and subtitles.
            */

            /*
                Production target minifies and combines all stylsheets for fast
                content delivery and minimal file size. Sourcemaps are ommited
                from a production setup, use development for sourcemaps.
            */
            production: {
                // Per-target options
                options: {
                    sourceMap: false,
                },

                // Syntax 'path/min.css': ['path/src1.css', 'path/src2.css']
                files: {
                    'public/css/index.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/common.css',
                        'resources/sources/css/index.css',
                        'resources/sources/css/chat-ui.css'
                    ],
                    'public/css/information.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/common.css',
                        'resources/sources/css/information.css'
                    ],
                    'public/css/session.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/common.css',
                        'resources/sources/css/session.css'
                    ],
                    'public/css/wait.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/common.css',
                        'resources/sources/css/wait.css'
                    ],
                    'public/css/error.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/common.css',
                        'resources/sources/css/error.css'
                    ],
                    'public/css/offended.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/common.css',
                        'resources/sources/css/offended.css'
                    ],
                    'public/css/50x.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/common.css',
                        'resources/sources/css/50x.css'
                    ],
                }
            },

            /*
                Development target minifies and combines stylesheets, for a
                production-equivelent speed (useful for benchmarks) while
                preserving sourcemaps for easier debugging
            */
            development: {
                // Per-target options
                options: {
                    sourceMap: true,
                },

                // Syntax 'path/min.css': ['path/src1.css', 'path/src2.css']
                files: {
                    'public/css/index.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/common.css',
                        'resources/sources/css/index.css',
                        'resources/sources/css/chat-ui.css'
                    ],
                    'public/css/information.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/common.css',
                        'resources/sources/css/information.css'
                    ],
                    'public/css/session.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/common.css',
                        'resources/sources/css/session.css'
                    ],
                    'public/css/wait.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/common.css',
                        'resources/sources/css/wait.css'
                    ],
                    'public/css/error.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/common.css',
                        'resources/sources/css/error.css'
                    ],
                    'public/css/offended.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/common.css',
                        'resources/sources/css/offended.css'
                    ],
                    'public/css/50x.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/common.css',
                        'resources/sources/css/50x.css'
                    ],
                }
            },
        },

        // Minifies Javascript files
        uglify: {
            // Global options. Per target options can also be defined.
            options: {
                report: 'gzip'
            },

            // Begin list of targets
            /*
                Production target combines, minifies, and mangles all the source
                files in order to reduce filesize and improve speed. sourcemaps
                are not included to save some additional bytes.
            */
            production: {
                options: {
                    sourceMap: false,
                    sourceMapIncludeSources: false,
                    mangle: true,
                },
                // Syntax 'path/min.css': ['path/src1.css', 'path/src2.css']
                files: {
                    'public/js/index.min.js': [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/socket.io-client/dist/socket.io.js',
                            'node_modules/bootstrap/dist/js/bootstrap.js',
                            'resources/sources/js/index.js',
                            'resources/sources/js/confetti.js',
                            'resources/sources/js/chat.js',
                            'resources/sources/js/chat-ui.js'
                    ],
                    'public/js/information.min.js': [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/bootstrap/dist/js/bootstrap.js',
                            'resources/sources/js/information.js',
                    ],
                    'public/js/session.min.js': [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/bootstrap/dist/js/bootstrap.js',
                    ],
                    'public/js/wait.min.js': [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/bootstrap/dist/js/bootstrap.js',
                            'resources/sources/js/wait.js',
                            'resources/sources/js/confetti.js'
                    ],
                    'public/js/error.min.js': [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/bootstrap/dist/js/bootstrap.js',
                    ],
                    'public/js/offended.min.js': [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/bootstrap/dist/js/bootstrap.js',
                    ],
                }
            },

            /*
                Developmet target is similar to production target, but includes
                sourcemaps for the minimized resources in order to faciliate
                debugging. Just ever so slightly larger.
            */
            development: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    mangle: true,
                },
                // Syntax 'path/min.css': ['path/src1.css', 'path/src2.css']
                files: {
                    'public/js/index.min.js': [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/socket.io-client/dist/socket.io.js',
                            'node_modules/bootstrap/dist/js/bootstrap.js',
                            'resources/sources/js/index.js',
                            'resources/sources/js/confetti.js',
                            'resources/sources/js/chat.js',
                            'resources/sources/js/chat-ui.js'
                    ],
                    'public/js/information.min.js': [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/bootstrap/dist/js/bootstrap.js',
                            'resources/sources/js/information.js',
                    ],
                    'public/js/session.min.js': [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/bootstrap/dist/js/bootstrap.js',
                            'resources/sources/js/information.js',
                    ],
                    'public/js/wait.min.js': [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/bootstrap/dist/js/bootstrap.js',
                            'resources/sources/js/wait.js',
                            'resources/sources/js/confetti.js'
                    ],
                    'public/js/error.min.js': [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/bootstrap/dist/js/bootstrap.js',
                    ],
                    'public/js/offended.min.js': [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/bootstrap/dist/js/bootstrap.js',
                    ],
                }
            },
        },

        // Static code analyzer for javascript files
        jshint: {
            // Global options. Per target options can also be defined.
            options: {

            },

            // Allows options to check both source files and compressed outputs
            sources: ['Gruntfile.js', 'resources/sources/js/**.js'],
            minified: ['Gruntfile.js', 'resources/sources/js/**.js'],
        },

        // Copies fonts and other files
        copy: {
            // Bootstrap fonts are basically the only files that need copying
            bootstrap: {
                expand: true,
                flatten: true,
                filter: 'isFile',
                src: 'node_modules/bootstrap/dist/fonts/*',
                // NOTE: The trailing '/' must be kept to indicate directory
                dest: 'public/fonts/',
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    // Register seperate production versus development-based tasks
    grunt.registerTask('development', ['jshint:sources', 'cssmin:development', 'uglify:development', 'copy']);
    grunt.registerTask('production', ['cssmin:production', 'uglify:production', 'copy']);

};
