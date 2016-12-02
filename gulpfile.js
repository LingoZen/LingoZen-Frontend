var gulp = require('gulp');
var awspublish = require('gulp-awspublish');
var inlinesource = require('gulp-inline-source');

var localConfig = {
    buildSrc: './build/**/*',
    getAwsConf: function (environment) {
        var conf = require('./awsConfig.js');
        if (!conf[environment]) {
            throw 'No aws conf for env: ' + environment;
        }

        if (!conf[environment + 'Headers']) {
            throw 'No aws headers for env: ' + environment;
        }

        return {keys: conf[environment], headers: conf[environment + 'Headers']};
    }
};

gulp.task('inlinesource', function () {
    return gulp.src('./src/*.html')
        .pipe(inlinesource())
        .pipe(gulp.dest('./out'));
});

gulp.task('s3:production', ['build:production'], function () {
    var awsConf = localConfig.getAwsConf('production');
    var publisher = awspublish.create(awsConf.keys);
    return gulp.src(localConfig.buildSrc)
        .pipe(awspublish.gzip({ext: ''}))
        .pipe(publisher.publish(awsConf.headers))
        .pipe(publisher.cache())
        .pipe(publisher.sync())
        .pipe(awspublish.reporter());
});
