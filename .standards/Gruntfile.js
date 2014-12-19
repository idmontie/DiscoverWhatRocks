module.exports = function (grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({
      // Metadata
      pkg: grunt.file.readJSON('package.json'),
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= props.license %> */\n',
      // JS Hint
      // =======
      jshint: {
        options: {
          jshintrc: '.jshintrc'
        },
        core: {
          src: '../*.js'
        },
        client: {
          src: [
            '../client/**/*.js',
            '../client/*.js'
          ]
        },
        server: {
          src: [
            '../server/**/*.js',
            '../server/*.js'
          ]
        },
        lib: {
          src: [
            '../lib/**/*.js',
            '../lib/*.js'
          ]
        }
      },
      // JS Coding Style
      // ===============
      jscs: {
        options: {
          config: '.jscsrc'
        },
        core: {
          src: '<%= jshint.core.src %>'
        },
        client: {
          src: '<%= jshint.client.src %>'
        },
        server: {
          src: '<%= jshint.server.src %>'
        },
        lib: {
          src: '<%= jshint.lib.src %>'
        }
      },
      // SCSS Lint
      // =========
      scsslint: {
          allFiles: [
              '../client/styles/scss/*.scss'
          ],
          options: {
            config: '.scss-lint.yml'
        }
      },
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-scss-lint');

    // Default task
    grunt.registerTask('default', [
        'jshint', 
        'jscs',
        'scsslint']);
};
