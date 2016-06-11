var gulp = require('gulp'),
    wrap = require('./lib/gulp-wrap'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify');


var paths = {
    jsFrom: './src/*.js',
    jsTo: './dist'
};


gulp.task('default', function () {
    return gulp.src(paths.jsFrom)
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(concat('task.js'))
        .pipe(wrap(';(function(){\n', '\n})();'))
        .pipe(gulp.dest(paths.jsTo))
        .pipe(uglify())
        .pipe(concat('task.min.js'))
        .pipe(gulp.dest(paths.jsTo));
});