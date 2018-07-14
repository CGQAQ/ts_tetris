var gulp = require('gulp');
var gulpu = require('gulp-uglify');
var gulpr = require('gulp-rename');


gulp.task('uglify', function() {
    gulp.src('./dist/main.js')
        .pipe(gulpu())
        .pipe(gulpr('main.min.js'))
        .pipe(gulp.dest('./docs/'));
})