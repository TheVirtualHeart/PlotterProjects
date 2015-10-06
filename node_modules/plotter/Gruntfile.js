module.exports = function(grunt) {

	// load plugins
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.initConfig({
		// browserify: {
		// 	plotter: {
		// 		src: ['src/**/*.js'],
		// 		dest: 'plotter.dev.js',
		// 		options: {
		// 			browserifyOptions: {
		// 				standalone: 'src/**/*.js'
		// 			}
		// 		}
		// 	}
		// },
		concat: {
			plotter: {
				options: {
					separator: ';\n'
				},
				src: [
					'src/point.js', 
					'src/line.js',
					'src/plotter.js', 
					'src/plot.js'
				],
				dest: 'plotter.dev.js'
			}
		},
		uglify: {
			plotter: {
				options: {
					mangle: false
				},
				files: {
					'plotter.min.js': ['plotter.dev.js']
				}
			}
		}
	});

	grunt.registerTask('build', ['concat', 'uglify']);
	grunt.registerTask('default', ['concat']);
}