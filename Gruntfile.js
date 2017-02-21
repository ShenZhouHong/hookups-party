/*
    Gruntfile is used to configure grunt in order to automate tasks like
    file minification. Everything has to be wrapped inside the module.exports
    object. A Gruntfile is a valid javascript file.
*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Minifies javascript files
    uglify: {
        options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            mangle: false
        },
        javascript: {
            src: 'resources/javascript/scripts.js',
            src: 'resources/javascript/chat.js',
            dest: 'public/javascript/index.min.js',
        }
    },

    // Minifies CSS stylesheets
    cssmin: {
        options: {
            mergeIntoShorthands: false,
            roundingPrecision: -1
        },
        target: {
            files: {
                /* Creates the index.min.css file for index.hbs */
                'public/stylesheets/index.min.css': [
                    'resources/stylesheets/fonts.css',
                    'resources/stylesheets/style.css',
                ],
                /* Creates the information.min.css file for information.hbs */
                'public/stylesheets/information.min.css': [
                    'resources/stylesheets/fonts.css',
                    'resources/stylesheets/information.css',
                ]
            }
        }
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load the plugin that uglifys css as well
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'cssmin']);

};
