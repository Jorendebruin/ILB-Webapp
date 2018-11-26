var gulp = require('gulp'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    watch = require('gulp-watch'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat');

var config = {
  uri: 'http://localhost',
  port: 3000,
  paths: {
    html: 'app/**/*.html',
    js: 'app/**/*.js',
    sass: 'app/**/*.scss',
    mainJs: 'app/main.js',
    mainSass: 'app/style.scss',
    dist: 'dist'
  }
};

gulp.task('html', () => {
  gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
});

gulp.task('js', () => {
  browserify(config.paths.mainJs)
    .transform(babelify, { presets: ["es2015", "react"] })
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
});

gulp.task('sass', () => {
  return gulp.src(config.paths.mainSass)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
});

gulp.task('watch', () => {
  gulp.watch(config.paths.html, ['html']);
  gulp.watch(config.paths.js, ['js']);
  gulp.watch(config.paths.sass, ['sass']);
});

gulp.task('connect', () => {
  connect.server({
    root: [config.paths.dist, 'node_modules'],
    port: config.port,
    livereload: true
  });
});

gulp.task('open', ['connect'], () => {
  gulp.src(config.paths.dist)
    .pipe(open({
      uri: `${config.uri}:${config.port}`
    }));
});

gulp.task('build', ['html', 'js', 'sass']);

gulp.task('default', ['build', 'watch', 'open']);
