'use strict'

const gulp = require('gulp')
const browserSync = require('browser-sync')
const plumber = require('gulp-plumber')
const logger = require('gulp-logger')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const debug = require('gulp-strip-debug')
const uglify = require('gulp-uglify')
const jshint = require('gulp-jshint')
const jshintStylish = require('jshint-stylish')
const imagemin = require('gulp-imagemin')
const spritesmith = require('gulp.spritesmith')
const svgSprite = require('gulp-svg-sprites')
const usemin = require('gulp-usemin')
const htmlmin = require('gulp-htmlmin')
const cssmin = require('gulp-cssmin')
const rev = require('gulp-rev')
const clean = require('gulp-clean')

const onError = (err) => {
  console.log(err.message)
  this.emit('end')
}

const paths = {
  src: 'src',
  dist: 'app'
}

gulp.task('sass', () => (
  gulp.src(`${paths.src}/scss/**/*.scss`)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(logger({
      before: 'starting sass task...',
      after: 'sass task complete!',
      extname: '.scss',
      showChange: true
    }))
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest(`${paths.dist}/assets/css/`))
))

gulp.task('jshint', () => (
  gulp.src(`${paths.src}/js/**/*.js`)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(logger({
      before: 'starting hint task...',
      after: 'hint task complete!',
      showChange: true
    }))
    .pipe(jshint())
    .pipe(jshint.reporter(jshintStylish))
))

gulp.task('scripts', ['jshint'], () => (
  gulp.src([
    `${paths.src}/js/func1.js`,
    `${paths.src}/js/func2.js`
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
    .pipe(gulp.dest(`${paths.dist}/assets/js/`))
))

gulp.task('images', () => (
  gulp.src(`${paths.src}/**/*.{jpg,png,svg}`)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(logger({
      before: 'starting images task...',
      after: 'images task complete!',
      showChange: true
    }))
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 7 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true }
        ]
      })
    ]))
    .pipe(gulp.dest(`${paths.dist}/assets/`))
))

gulp.task('svg-sprite', ['images'], () => (
  gulp.src(`${paths.dist}/assets/svg/icons/*.svg`)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(logger({
      before: 'starting svg-sprite task...',
      after: 'svg-sprite task complete!',
      showChange: true
    }))
    .pipe(svgSprite({
      selector: 'icon-svg-%f',
      svg: { sprite: 'sprite/sprite-svg.svg' },
      preview: { sprite: 'svg-sprite-preview.html' },
      templates: { scss: true }
    }))
    .pipe(gulp.dest(`${paths.dist}/assets/`))
))

gulp.task('sprite', () => (
  gulp.src(`${paths.src}/img/sprite-icons/**/*.png`)
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
    .pipe(gulp.dest(`${paths.dist}/assets/img/sprites`))
))

gulp.task('usemin', () => (
  gulp.src(`${paths.src}/html/**/*.html`)
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
    .pipe(gulp.dest(paths.dist))
))

gulp.task('watch', () => {
  gulp.watch(`${paths.src}/js/**/*.js`, ['scripts'])
  gulp.watch(`${paths.src}/scss/**/*.scss`, ['sass'])
  gulp.watch(`${paths.src}/html/**/*.html`, ['htmlmin'])
})

gulp.task('clean', () => (
  gulp.src(`${paths.dist}/assets/**/*`, { read: false })
    .pipe(clean({ force: true }))
))

gulp.task('build', ['clean'], () => (
  gulp.start('sass', 'scripts', 'usemin')
))

gulp.task('server', ['watch', 'build'], () => {
  browserSync.init({
    server: { baseDir: paths.dist }
  })

  gulp.watch(`${paths.dist}/**/*`).on('change', browserSync.reload)
})

gulp.task('default', ['server'])
