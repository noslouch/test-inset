const path = require('path');
const fs = require('fs');
const minify = require('html-minifier').minify;
const argv = require('yargs').argv;
const chokidar = require('chokidar');
const colors = require('colors');
const fileinclude = require('gulp-file-include');
const gulp = require('gulp');

JSON.minify = require('node-json-minify');

function generateInset(){
  return new Promise((resolve, reject) => {
    const inset = JSON.parse('{"status":"OK","type":"InsetDynamic","platforms":["desktop"],"serverside":{"data":{"url":null},"template":{"url":null}}}');
    const data = fs.readFileSync('./inset/data.json', 'utf8');
    const html = fs.readFileSync('./inset/template.html', 'utf8');

    inset.serverside.data.data = JSON.parse(JSON.minify(data));
    inset.serverside.template.template = minify(html, {
      removeComments: true,
      removeEmptyAttributes: true
    });

    fs.writeFile(`dist/inset.json`, JSON.stringify(inset), 'utf8', err => {
      if(err) reject('error saving file');
      resolve();
    });
  });
}

if (argv.build) {
  console.log(colors.blue('Preparing build'));
  generateInset().then(() => console.log(colors.green('Build complete')));
}

if (argv.watch) {
  const watcher = chokidar.watch(['inset/'], {
    ignored: /[\/\\]\./, persistent: true
  });

  watcher
    .on('add', (path) => console.log(colors.blue(`File ${path} has been added`)))
    .on('ready', () => console.log(colors.blue('Watching for changes.')))
    .on('change', () => {
      generateInset().then(() => console.log(colors.green('Rebuild complete')));
    });
}

gulp.task('fileinclude', () => {
  gulp.src(['./libs/articles/index-article.html', './libs/articles/index-immersive.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true
    }))
    .pipe(gulp.dest('./'));
});
