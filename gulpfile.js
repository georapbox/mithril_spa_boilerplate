/* jshint ignore:start */
var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    compass = require('gulp-compass'),
    minifyCss = require('gulp-minify-css');


/**
 * ---------------------------------
 * TASKS FOR DEVELOPMENT ENVIRONMENT
 * ---------------------------------
 */
gulp.task('browserify', function () {
    return browserify('./src/js/main.js', {
        debug: true
    }).
    bundle().
    pipe(source('bundle.js')).
    pipe(gulp.dest('src/js'));
});

gulp.task('compass', function() {
    gulp.
        src('src/sass/bundle.scss').
        pipe(compass({
            config_file: './config.rb',
            css: 'src/css',
            sass: 'src/sass',
            sourcemap: true,
            style: 'expanded',
            comments: 'normal'
        })).
        pipe(gulp.dest('src/css'));
});

gulp.task('build:dev', ['browserify', 'compass']);

gulp.task('watch', function () {
    gulp.watch('src/**/*.*', ['build:dev']);
});


/**
 * --------------------------------
 * TASKS FOR PRODUCTION ENVIRONMENT
 * --------------------------------
 */
gulp.task('copy', function () {
    gulp.
        src('src/index.html').
        pipe(gulp.dest('dist'));
});

gulp.task('js-uglify', function () {
    gulp.
        src('src/js/bundle.js').
        pipe(uglify()).
        pipe(gulp.dest('dist/js'));
});

gulp.task('css-minify', function () {
    gulp.
        src('src/css/bundle.css').
        pipe(minifyCss()).
        pipe(gulp.dest('dist/css'));
});

gulp.task('build:live', ['copy', 'js-uglify', 'css-minify']);
/* jshint ignore:end */
