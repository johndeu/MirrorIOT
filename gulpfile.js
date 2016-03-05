var gulp = require('gulp');
var ts = require('gulp-typescript');

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('default', ['scripts']);

gulp.task('scripts', function () {
    var tsResult = tsProject.src('./app/**/*.ts')
        .pipe(ts(tsProject));
        
    return tsResult.pipe(gulp.dest('.'));
});


gulp.task('watch', ['scripts'], function() {
    gulp.watch('app/**/*.ts', ['scripts']);
});



