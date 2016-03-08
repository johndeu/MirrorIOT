var path = require('path');
var os = require('os');
var gulp = require('gulp');
var ts = require('gulp-typescript');

var tsProject = ts.createProject('./tsconfig.json');

var hwa = null;
if (os.platform() === 'win32') {
  try {
    hwa = require('hwa');
  } catch (err) {
    console.log(err);
  }
}


gulp.task('default', ['scripts']);

gulp.task('scripts', function () {
    var tsResult = tsProject.src('./app/**/*.ts')
        .pipe(ts(tsProject));
        
    return tsResult.pipe(gulp.dest('.'));
});


gulp.task('watch', ['scripts'], function() {
    gulp.watch('app/**/*.ts', ['scripts']);
});


gulp.task('appx', done => {
  if (hwa) {
    hwa.registerApp(path.resolve("package.appxmanifest"));
  } else {
    console.log('You need to be running Windows 10 launch the app');
  }

  done();
});


