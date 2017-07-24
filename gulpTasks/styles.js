import gulp from 'gulp';
import sass from 'gulp-sass';
import pathsConfig from '../config/pathsConfig';

gulp.task('styles', () => {
  return gulp.src([
    pathsConfig.src + '/styles/**/*.scss',
    '!**/_*.scss'
  ])
    .pipe(sass())
    .pipe(gulp.dest(pathsConfig.dist + '/styles'))
});
