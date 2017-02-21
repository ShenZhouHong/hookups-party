/*
    Gruntfile is used to configure grunt in order to automate tasks like
    file minification. Everything has to be wrapped inside the module.exports
    object. A Gruntfile is a valid javascript file.
*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    cssmin: {
        options: {
            mergeIntoShorthands: false,
            roundingPrecision: -1
        },
        target: {
            files: [{
                 expand: true,
                 cwd: 'resources/stylesheets',
                 src: ['*.css', '!*.min.css'],
                 dest: 'public/stylesheets',
                 ext: '.min.css'
           }]
       },
       combine: {
            files: {
                'public/stylesheets/index.min.css': ['public/stylesheets/**/*.css']
            }
        }
    },

    // Uglifies javascript files
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      javascript: {
        src: 'resources/javascript/jquery.min.js',
        src: 'resources/javascript/bootstrap.min.js',
        src: 'resources/javascript/scripts.js',
        src: 'resources/javascript/chat.js',
        dest: 'public/javascript/index.min.js',
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
