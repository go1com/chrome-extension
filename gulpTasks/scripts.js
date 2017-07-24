import gulp from 'gulp';
import babel from 'gulp-babel';
import sourceMaps from 'gulp-sourcemaps';
import pathsConfig from '../config/pathsConfig';

function buildScript(input, output) {
  gulp.src(input)
    .pipe(sourceMaps.init())
    .pipe(babel({
      "sourceMap": true,
      "presets": ["es2015", "stage-0", "import-export"],
      "plugins": ["transform-async-to-generator"]
    }))
    .pipe(sourceMaps.write('.'))
    .pipe(gulp.dest(output))
}

gulp.task('script', () => {
  buildScript([pathsConfig.src + '/injects/content-script.js'], pathsConfig.dist + '/injects');
});
