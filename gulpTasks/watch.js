import gulp from 'gulp';

gulp.task(`watch`, () => {
	gulp.watch(`./src/styles/**/*.scss`, ['styles']);
});
