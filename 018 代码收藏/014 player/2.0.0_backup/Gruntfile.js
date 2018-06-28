'use strict';
module.exports = function (grunt) {
	//
	var fs = require('fs'); 
	var pkg = grunt.file.readJSON('package.json');
	//
	grunt.initConfig({
		//es6转为es5
		babel : {
			build : {
				options : {
							presets: ['es2015']
						},
				files : { }
			}
		},
		sprite: {
			build : {
				src : pkg.src + 'css/*.png',
				dest : pkg.css + 'player_sprite.png',
				destCss: pkg.css + 'sprites.css'
			}
		},
		copy : {
			build : {
				files : [{
							expand : true,
							cwd : pkg.src + 'css/',
							src : ['**/*', '!*.png'],
							dest: pkg.css
						}]
					}
		},
		//文件合并
		concat: {
			options	: {
						separator: ';'
					},
			build : {
						src : [	
								pkg.lib + 'zepto/1.2.0/zepto.js', 
								pkg.lib + 'zepto-plugin/**/*.js',
								pkg.lib + 'puremvc-1.0.1.js'
							],
						dest : pkg.js + pkg.name + '-min.js'
					}
		},
		//文件压缩
		uglify : {
			options	: {
						mangle: {
							except: ['puremvc', 'define'] //保留字符
						},
						banner: '/**'
							 + '\n * ...'
							 + '\n * @author ' + pkg.author
							 + '\n * <%= grunt.template.today("yyyy-mm-dd") %>'
							 + '\n */'
							 + '\n',
						preserveComments : false // all(不删除注释), false(删除全部注释), some(保留@preserve @license @cc_on等注释)
					},
			build	: {
						files : [{
									expand: true,
									cwd : pkg.js,//被压缩目录
									src	: pkg.name + '-min.js',//被压缩文件
									dest: pkg.js,//输出目录
								}]
					}
		},
		//文件css压缩
		cssmin : {
			build	: {
						files : [{
									expand: true,
									cwd : pkg.css,//被压缩目录
									src	: '**/*.css',//被压缩文件
									dest: pkg.css,//输出目录
								}]
					}
		},
		//文件修改监控
		watch : {
			build : {
				files : [pkg.src + '/**/*.js', pkg.src + '/**/*.css'],
				tasks : ['reload'],
				options : {
							debounceDelay : 0.1 * 1000,
							reload : false,
							livereload: true
						}
			}
		},
		//清理文件
		clean : {
			temp : [pkg.build],
			dist : [pkg.js, pkg.css]
		}
	});
	
	var cfg = grunt.config.data,
		limitsize = 0,
		isExceptFile = (filePath) => /css|player-share|es6/ig.test(filePath),
		walk = (path)=>{
						var list = [];    
						fs.readdirSync(path).forEach((item)=>{
														item = path + '/' + item;
														var items = fs.statSync(item);
														if (items && items.isDirectory()) {//判断是文件还是路径
															list = list.concat(walk(item));
														} else {
															if (items.size > limitsize) {
																list.push(item);
															} else {
																grunt.log.writeln(`已过滤异常File【limitsize:${limitsize}Byte】==>> ${path}/${item} :${items.size} Byte`);
															}
														}
													});
						return list;
					};
	var build = (option)=>{
							walk(pkg.src).forEach((item)=>{
															if (isExceptFile(item)) {
																if (item.indexOf('es6') != -1) {
																	grunt.log.writeln(`必须构建为ES5的File ==>> ${item}`);
																	var dest = item.replace(/.es6/, '');
																	dest = pkg.build + dest.substring(dest.lastIndexOf('/'), dest.length);
																	cfg.babel.build.files[dest] = item;
																}
															} else {
																cfg.copy.build.files.push({
																							src : item,
																							dest: pkg.build + item.substring(item.lastIndexOf('/'), item.length)
																						})
															}
														});
							grunt.task.run([
											'clean:dist',
											'babel:build',
											'sprite:build',
											'copy:build'
										]);
							var concatlst = cfg.concat.build.src;
							grunt.config.set('concat.build.src', concatlst.concat([pkg.build+'**/*.js']));
							if (option == undefined) {
								grunt.log.writeln('set [concat.build] done 执行合并压缩:\n');
								grunt.task.run([
												'concat:build',
												'uglify:build',
												'cssmin:build',
												'clean:temp'
											]);
							} else {
								grunt.log.writeln('set [concat.build] done 执行测试合并 :\n');
								if (option == 'reload') {
									grunt.task.run([
													'concat:build',
													'watch:build',
													'clean:temp'
												]);
								} else if (option == 'test') {
									grunt.task.run([
													'concat:build',
													'clean:temp'
												]);
								}
							}
						}
	//
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-spritesmith');
	//
	grunt.registerTask('execute', 'concat and uglify task', function() {
																		build();
																	});
	grunt.registerTask('test', 'concat and uglify task', function() {
																	build('test');
																});
	grunt.registerTask('reload', 'concat and uglify task', function() {
																	build('reload');
																});
};