const fileinclude = require('gulp-file-include');
const gulp = require('gulp');

gulp.task('buildArticle', () => {
  return gulp.src(['./libs/articles/article-standard.html', './libs/articles/article-immersive.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true
    }))
    .pipe(gulp.dest('./'));
});