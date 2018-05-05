const gulp = require('gulp');

const ts = require('gulp-typescript');
const tsProject = ts.createProject('./tsconfig.json');

const paths = {
  protos: ['src/proto/engine/engine/executionService.proto']
};

gulp.task('copy-proto', () => {
  return gulp.src(paths.protos).pipe(gulp.dest('dist/proto'));
});

gulp.task('ts', ['copy-proto'], () => {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('dist'));
});
