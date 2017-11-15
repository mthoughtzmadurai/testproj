var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount (express, point) {
	'use strict';
	return express.static(path.resolve(point));
};


module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			bootstrapLess: {
				files: [{
					expand: true,
					src: '*.less',
					dest: 'app/less/lib/bootstrap/',
					filter: 'isFile',
					cwd: path.join(__dirname, 'components', 'bootstrap', 'less')
				}, {
					expand: true,
					src: '*.png',
					dest: 'app/public/images/bootstrapicons',
					filter: 'isFile',
					cwd: path.join(__dirname, 'components', 'bootstrap', 'img')
				}]
			}
		},
		jshint: {
			all: ['public/**/*.js', 'routes/*.js', 'routes/**/*.js', 'app.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		express: {
			livereload: {
				options: {
					port: 9000,
					monitor: {},
					debug: true,
					server: path.resolve('app.js'),
					delay:10
					// middleware: function (express, options) {
					// 	return [lrSnippet, folderMount(express, options.base)];
					// }
				}
			},
		},
		open: {
			dev: {
				path: 'http://localhost:9000'
			}
		},
		// watch: {
		// 	files: ['app.js', 'app/**/*.*'],
		// 	tasks:['express']
		// },
		watch: {
        files:  [ 'app.js','app/**/*.*' ],
        tasks:  [ 'express:dev' ],
        options: {
          spawn: false
        }
		},
   		// // },
		external_daemon: {
			redis: {
				cmd: 'redis-server',
				args: [
					'--loglevel',
					'debug'
				]
			},
			mongodb: {
				cmd: 'mongod',
				args: []
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-livereload');
	grunt.loadNpmTasks('grunt-external-daemon');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.registerTask('serve', ['jshint',  'express','open', 'livereload-start']);
	
	grunt.registerTask('server', ['jshint', 'copy:bootstrapLess', 'external_daemon:redis', 'external_daemon:mongodb', 'open', 'livereload-start', 'express', 'watch']);
	grunt.registerTask('default', ['jshint', 'express', 'open', 'express-keepalive']);
};