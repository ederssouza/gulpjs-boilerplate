'use strict';

let gulp 					= require('gulp'),
		browserSync 	= require('browser-sync'),
		plumber  			= require('gulp-plumber'),
		logger 				= require('gulp-logger'),
		sass 					= require('gulp-sass'),
		concat 				= require('gulp-concat'),
		debug 				= require('gulp-strip-debug'),
		uglify 				= require('gulp-uglify'),
		jshint 				= require('gulp-jshint'),
		jshintStylish = require('jshint-stylish'),
		imagemin			= require('gulp-imagemin'),
		spritesmith 	= require('gulp.spritesmith'),
		svgSprite 		= require('gulp-svg-sprites'),
		usemin 				= require('gulp-usemin'),
		htmlmin 			= require('gulp-htmlmin'),
		cssmin 				= require('gulp-cssmin'),
		rev 					= require('gulp-rev'),
		clean 				= require('gulp-clean');


var onError = function (error) {
  console.log(error.message);
  this.emit('end');
}


/**
 *	Compiles sass files (asynchronous task)
 *	[https://www.npmjs.com/package/gulp-sass]
 */

gulp.task('sass', () => {

	gulp.src('src/scss/**/*.scss')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(logger({
			before: 'starting sass task...',
			after: 'sass task complete!',
			extname: '.scss',
			showChange: true
		}))
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(gulp.dest('app/assets/css/'))
});


/**
 *	Detects errors and potential problems in JavaScript code (synchronous task)
 *	[https://www.npmjs.com/package/gulp-jshint]
 */

gulp.task('jshint', () =>

	gulp.src('src/js/**/*.js')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(logger({
			before: 'starting hint task...',
			after: 'hint task complete!',
			showChange: true
		}))
		.pipe(jshint())
		.pipe(jshint.reporter(jshintStylish))
);


/**
 *	Concatenates, removes debugs (cosole.log(), alert(), ...) and minifies JavaScript (asynchronous task)
 *	gulp-concat 		 => [https://www.npmjs.com/package/gulp-concat]
 *	gulp-strip-debug => [https://www.npmjs.com/package/gulp-strip-debug]
 * 	gulp-uglify 		 => [https://www.npmjs.com/package/gulp-uglify]
 */

gulp.task('scripts', ['jshint'], () => {

  gulp.src([
    'src/js/jquerytojs.min.js'
  ])
  	.pipe(plumber({ errorHandler: onError }))
		.pipe(logger({
			before: 'starting scripts task...',
			after: 'scripts task complete!',
			extname: '.js',
			showChange: true
		}))
	  .pipe(concat('app.min.js'))
	  .pipe(debug())
	  .pipe(uglify())
	  .pipe(gulp.dest('app/assets/js/'));
});


/**
 *	Optimize images (asynchronous task)
 *	gulp-imagemin => [https://www.npmjs.com/package/gulp-imagemin]
 */

gulp.task('images', () =>

  gulp.src('src/**/*.{jpg,png,svg}')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(logger({
			before: 'starting images task...',
			after: 'images task complete!',
			showChange: true
		}))
		.pipe(imagemin([
		  // imagemin.gifsicle({interlaced: true}),
		  // imagemin.jpegtran({progressive: true}),
		  // imagemin.optipng({optimizationLevel: 7}),
		  // imagemin.svgo({plugins: [{removeViewBox: true}]})
		  interlaced: true,
		  progressive: true,
		  optimizationLevel: 7,
		  svgoPlugins: [{removeViewBox: true}]
		]))
    .pipe(gulp.dest('app/assets/'))
);


/**
 *	Generated SVG sprite
 *	[https://www.npmjs.com/package/gulp-svg-sprites]
 */

gulp.task('svg-sprite', ['images'], () => {

	gulp.src('app/assets/svg/icons/*.svg')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(logger({
			before: 'starting svg-sprite task...',
			after: 'svg-sprite task complete!',
			showChange: true
		}))
		.pipe(svgSprite({
			selector: "icon-svg-%f",
			svg: { sprite: "sprite/sprite-svg.svg" },
			preview: { sprite: "preview.html" },
			templates: { scss: true }
		}))
		.pipe(gulp.dest('app/assets/'))
});


/**
 *	Convert a set of images into a spritesheet and CSS variables (asynchronous task)
 *	gulp.spritesmith => [https://www.npmjs.com/package/gulp.spritesmith]
 */

gulp.task('sprite', () => {

  gulp.src('src/img/sprite-icons/**/*.png')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(logger({
			before: 'starting sprite task...',
			after: 'sprite task complete!',
			showChange: true
		}))
	  .pipe(spritesmith({
	    imgName: 'sprite.png',
	    // cssName: '_sprite.scss'
	    cssName: '_sprite.css'
	  }))
  	.pipe(gulp.dest('app/assets/img/sprites'));
});


/**
 *	Replaces references to non-optimized scripts or stylesheets
 *	into a set of HTML files (or any templates/views) (asynchronous task)
 *	gulp-usemin => [https://www.npmjs.com/package/gulp-usemin]
 */

gulp.task('usemin', () => {

  gulp.src('src/html/**/*.html')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(logger({
			before: 'starting usemin task...',
			after: 'usemin task complete!',
			showChange: true
		}))
    .pipe(usemin({
      css: [ cssmin, rev ],
      html: [
      	htmlmin({
      		collapseWhitespace: true,
      		removeComments: true,
      		minifyCSS: true,
      		minifyJS: true
      	})
      ],
      js: [ uglify, rev ],
      inlinejs: [ uglify ]
    }))
    .pipe(gulp.dest('app/'));
});


/**
 *	Checks changes to .js, .scss, and .html files
 *	and run related tasks (asynchronous task)
 */

gulp.task('watch', () => {

	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('src/html/**/*.html', ['htmlmin']);
});


/**
 *	Removes folders and files from the app folder (synchronous task)
 *	gulp-clean => [https://www.npmjs.com/package/gulp-clean]
 */

gulp.task('clean', () =>

	gulp.src('app/**/*', { read: false })
		.pipe(clean({ force: true }))
);


/**
 *	Runs all tasks (synchronous task)
 */

gulp.task('build', ['clean'], () =>

	gulp.start('sass', 'scripts', 'usemin', 'watch')
);


/**
 *	Keep multiple browsers & devices in sync when building websites (asynchronous task)
 *	browser-sync => [https://www.npmjs.com/package/browser-sync]
 */

gulp.task('server', ['build'], () => {

	browserSync.init({
		server: {
			baseDir: 'app/'
		}
	});

	gulp.watch('src/**/*').on('change', browserSync.reload);
});


/**
 *	Runs default task
 */

gulp.task('default', ['server']);