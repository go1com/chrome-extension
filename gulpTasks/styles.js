import gulp from 'gulp';
import sass from 'gulp-sass';
import pathsConfig from '../config/pathsConfig';

gulp.task('styles', () => {
  return gulp.src([
    pathsConfig.src + '/styles/**/*.scss',
    '!**/_*.scss'
  ])
    .pipe(sass())
    .on('error', function(error) {
      console.log(error.toString());
      this.emit('end');
    })
    .pipe(gulp.dest(pathsConfig.dist + '/styles'))
});
