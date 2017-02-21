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
                sourceMap: true,
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },

            // Begin list of targets
            index: {
                // Syntax 'path/min.css': ['path/src1.css', 'path/src2.css']
                files: {
                    'public/css/index.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/index.css'
                    ],
                }
            },
            information: {
                // Syntax 'path/min.css': ['path/src1.css', 'path/src2.css']
                files: {
                    'public/css/information.min.css': [
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'resources/sources/css/fonts.css',
                        'resources/sources/css/information.css'
                    ],
                }
            }
        },

        // Minifies Javascript files
        uglify: {
            // Global options. Per target options can also be defined.
            options: {
                sourceMap: true,
                mangle: false
            },

            // Begin list of targets
            index: {
                // Syntax 'path/min.css': ['path/src1.css', 'path/src2.css']
                files: {
                    'public/js/index.min.js': [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/socket.io-client/dist/socket.io.js',
                            'node_modules/bootstrap/dist/js/bootstrap.js',
                            'resources/sources/js/index.js',
                            'resources/sources/js/chat.js'
                        ],
                }
            },
            information: {
                // Syntax 'path/min.css': ['path/src1.css', 'path/src2.css']
                files: {
                    'public/js/information.min.js': [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/bootstrap/dist/js/bootstrap.js',
                            'resources/sources/js/information.js',
                        ],
                }
            }
        },
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task.
    grunt.registerTask('default', ['cssmin', 'uglify']);

};
