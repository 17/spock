# Wrapper function
module.exports = (grunt) ->

  #Initialize grunt
  grunt.initConfig

    # Read package.json
    pkg: grunt.file.readJSON("package.json")

    nodewebkit:
      options:
        build_dir:'build'
        mac_icns: './src/resource/icon512x512.icns'

      buold:
        options:
          win: true
          mac: false
        src: ['src/**/*']

      dist:
        options:
          mac: true
          win: true
          linux32: true
          linux64: true
        src: ['src/**/*']

  # Load Grunt Dependencies
  require("load-grunt-tasks") grunt

  # load task
  grunt.registerTask "build", [
    'nodewebkit:buold'
  ]

  grunt.registerTask "dist", [
    'nodewebkit:dist'
  ]

  # Create Default Task
  grunt.registerTask "default", ["build"]