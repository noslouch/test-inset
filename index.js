const path = require('path');
const fs = require('fs');
const minify = require('html-minifier').minify;
const argv = require('yargs').argv;
const chokidar = require('chokidar');
const colors = require('colors');
const request = require('superagent');
const prettyjson = require('prettyjson');
const fileinclude = require('gulp-file-include');
const gulp = require('gulp');

const DATA = require('./inset/data.json');

const destinations = (slug) => ({
  local: {
    cssUrl: './dist/app.css',
    jsUrl: './dist/app.js'
  },
  remote: {
    cssUrl: `https://asset.wsj.net/wsjnewsgraphics/dice/${slug}/app.css`,
    jsUrl: `https://asset.wsj.net/wsjnewsgraphics/dice/${slug}/app.js`
  }
});

JSON.minify = require('node-json-minify');

function generateInset(isProduction){
  return new Promise((resolve, reject) => {
    const inset = JSON.parse('{"status":"OK","type":"InsetDynamic","platforms":["desktop"],"serverside":{"data":{"url":null},"template":{"url":null}}}');
    const html = fs.readFileSync('./inset/template.html', 'utf8');

    const assets = isProduction ? destinations(DATA.slug).remote : destinations().local;

    inset.serverside.data.data = Object.assign({}, DATA, assets);
    inset.serverside.template.template = minify(html, {
      removeComments: true,
      removeEmptyAttributes: true
    });

    const space = isProduction ? null : '\t';

    fs.writeFile(`dist/inset.json`, JSON.stringify(inset, null, space), 'utf8', err => {
      if(err) reject('error saving file');
      resolve();
    });
  });
}

if (argv.buildInset) {
  console.log(colors.blue('Preparing inset build...'));
  generateInset(argv.production).then(() => console.log(colors.green('Inset build complete.')));
}

if (argv.watch) {
  const watcher = chokidar.watch(['inset/'], {
    ignored: /[\/\\]\./, persistent: true
  });

  watcher
    .on('add', (path) => console.log(colors.blue(`File ${path} has been added.`)))
    .on('ready', () => {
      generateInset().then(() => {
        console.log(colors.green('Initial build complete.'))
        console.log(colors.blue('Watching for changes.'))
      });
    })
    .on('change', () => {
      generateInset().then(() => console.log(colors.green('Rebuild complete.')));
    });
}

if (argv.deploy) {
  console.log(colors.blue('Preparing deployment...'));

  if (!DATA.slug) return console.log(colors.red('Please add a slug to `src/config.json`.'));

  // gather files to deploy
  const files = fs.readdirSync('dist');

  // create requests
  const promises = files.map(file => {
    return request
      .post(`http://int.production.file-uploader.virginia.dj01.onservo.com/api/v2/dice/${DATA.slug}/${file}`)
      .attach('file', `dist/${file}`);
  });

  // send requests
  Promise.all(promises)
    .then(responses => {
      responses.forEach(response => {
        console.log(prettyjson.render(response.body.urls));
        console.log('---');
      })
    })
    .catch(error => {
      console.log(colors.red(error));
    });

  console.log(colors.blue('Deployment completed.'));
}

gulp.task('buildArticle', () => {
  gulp.src(['./libs/articles/article-standard.html', './libs/articles/article-immersive.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true
    }))
    .pipe(gulp.dest('./'));
});
