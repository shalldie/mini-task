var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    browserify = require('browserify'),
    source = require("vinyl-source-stream"),
    buffer = require('vinyl-buffer'),
    rename = require('gulp-rename');

var paths = {
    jsFrom: './src/**/*.js',  // 所有js文件
    jsBase: './src/task.js',  // 入口文件
    jsTo: './dist',
    jsName: 'task.js',
    jsMinName: 'task.min.js'
}

gulp.task('default', function () {
    return browserify({
        entries: [paths.jsBase]
    })
        .bundle()
        .pipe(plumber(
            { errorHandler: notify.onError('Error: <%= error.message %>') }
        ))
        .pipe(source(
            paths.jsName
        ))
        .pipe(gulp.dest(
            paths.jsTo
        ))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename(
            paths.jsMinName
        ))
        .pipe(gulp.dest(
            paths.jsTo
        ));
});

gulp.task('watch', function () {
    gulp.watch(paths.jsFrom, ['default']);
});

