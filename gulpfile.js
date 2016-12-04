var gulp = require('gulp');
var inlinesource = require('gulp-inline-source');
var minifyHtml = require('gulp-minify-html');
var ngTemplate = require('gulp-ng-template-html');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var fileinclude = require('gulp-file-include');
var rename = require("gulp-rename");


gulp.task('inlinesource', function () {
    return gulp.src('./src/index.html')
        .pipe(inlinesource({
            compress: false
        }))
        .pipe(gulp.dest('./out'));
});

gulp.task('templates', function () {
    gulp.src('./src/pages/**/*.html')
    // .pipe(minifyHtml({empty: true, quotes: true}))
        .pipe(ngTemplate({
            moduleName: 'lingoApp'
        }))
        .pipe(gulp.dest('src/js/templates'));  // output file: 'dist/js/templates.js'&'dist/js/templates.html'
});

gulp.task('fileinclude', function () {
    gulp.src(['./src/original-index.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./src'));
});
