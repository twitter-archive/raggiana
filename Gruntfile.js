module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['statsViewer.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, flatten: true, src: ['bower_components/jquery-ui/themes/base/jquery-ui.css'], dest: 'dist/css', filter: 'isFile'},
          {expand: true, flatten: true, src: ['bower_components/jquery/jquery.js'], dest: 'dist/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['bower_components/jquery-ui/jquery-ui.js'], dest: 'dist/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['bower_components/rickshaw/rickshaw.css'], dest: 'dist/css', filter: 'isFile'},
          {expand: true, flatten: true, src: ['bower_components/rickshaw/examples/css/extensions.css'], dest: 'dist/css', filter: 'isFile'},
          {expand: true, flatten: true, src: ['bower_components/rickshaw/examples/images/**'], dest: 'dist/images/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['src/statsViewer.css'], dest: 'dist/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['src/index.html'], dest: 'dist/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['src/statsViewer.js'], dest: 'dist/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['bower_components/rickshaw/rickshaw.js'], dest: 'dist/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['bower_components/rickshaw/examples/js/extensions.js'], dest: 'dist/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['bower_components/rickshaw/vendor/d3.v2.js'], dest: 'dist/', filter: 'isFile'}
        ]
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },
    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: ['**']
      }
   });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('test', ['copy', 'karma']);
  grunt.registerTask('release', ['copy', 'gh-pages']);
  grunt.registerTask('default', ['copy']);

};
