(function() {
  "use strict";
  module.exports = function(grunt) {

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      concat_in_order: {
        default: {
          files: {
            "build/logger.js": [
              "assets/logger/intro.js",
              "assets/logger/stacktrace-0.5.js",
              "assets/logger/errorlogger.js",
              "assets/logger/outro.js"
            ],
            "build/vendor.js": [
              "assets/viewer/vendor/jquery/jquery.js",
              "assets/viewer/vendor/underscore/underscore.js",
              "assets/viewer/vendor/backbone/backbone.js",
              "assets/viewer/vendor/jquery.truncate.js",
              "assets/viewer/vendor/strftime.js"
            ],
            "build/app.js": [
              "assets/viewer/js/collections/projects.js",
              "assets/viewer/js/collections/errors.js",
              "assets/viewer/js/views/login.js",
              "assets/viewer/js/views/projects.js",
              "assets/viewer/js/views/newProject.js",
              "assets/viewer/js/views/editProject.js",
              "assets/viewer/js/views/errors.js",
              "assets/viewer/js/router.js"
            ]
          },
          options: {
            extractRequired: function () {
              return [];
            },
            extractDeclared: function () {
              return [];
            }
          }
        }
      }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    require('load-grunt-tasks')(grunt);
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.registerTask('default', ['concat_in_order']);

  };
}());
