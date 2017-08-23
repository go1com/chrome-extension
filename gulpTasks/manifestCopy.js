import gulp from 'gulp';
import replace from 'gulp-replace';

let config = require('../package.json');

gulp.task('manifest', () => {
  let source = gulp.src([
    './src/manifest.json'
  ]);


  source = source.pipe(replace('${PRODUCT_DESCRIPTION}', config.description));
  source = source.pipe(replace('${PRODUCT_VERSION}', config.version));
  source = source.pipe(replace('${PRODUCT_NAME}', config.productName));

  return source.pipe(gulp.dest('dist'));
});
