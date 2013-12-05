module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    browserify: {
      dist: {
        src: ['index.js'],
        dest: 'dist/build.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('build', ['browserify']);
};
