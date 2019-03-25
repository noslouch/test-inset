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
const puppeteer = require('puppeteer');
const screenshotDOMElement = require('./screencap.js');
const sizeOf = require('image-size');

const destinations = (slug) => ({
  local: {
    cssUrl: './dist/local/app.css',
    jsUrl: './dist/local/app.js',
    fallbackUrl: './dist/local/fallback.png'
  },
  remote: {
    cssUrl: `https://asset.wsj.net/wsjnewsgraphics/dice/${slug}/app.min.css`,
    jsUrl: `https://asset.wsj.net/wsjnewsgraphics/dice/${slug}/app.min.js`,
    fallbackUrl: `https://asset.wsj.net/wsjnewsgraphics/dice/${slug}/fallback.png`
  }
});

JSON.minify = require('node-json-minify');

function generateInset(isProduction){
  const DATA = JSON.parse(fs.readFileSync('./inset/data.json', 'utf8'));

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
    const filePath = isProduction ? 'dist/remote/inset.json' : 'dist/local/inset.json';

    fs.writeFile(filePath, JSON.stringify(inset, null, space), 'utf8', err => {
      if(err) reject('error saving file');
      resolve();
    });
  });
}

function generateFallback(isProduction,port=3000){
  const DATA = JSON.parse(fs.readFileSync('./inset/data.json', 'utf8'));
  const filePath = isProduction ? 'dist/remote' : 'dist/local';
  const inset = JSON.parse(fs.readFileSync(`${filePath}/inset.json`, 'utf8'));
  const fallbackPath = isProduction ? destinations(DATA.slug).remote.fallbackUrl : destinations().local.fallbackUrl;

  return new Promise (async (resolve, reject) => {
    if (DATA.createFallbackImage === true) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setViewport({width: 1000, height: 600, deviceScaleFactor: 2});
      await page.goto(`http://127.0.0.1:${port}/article-standard.html#wrap`, {waitUntil: 'networkidle2'});
      await screenshotDOMElement(`${filePath}/fallback.png`,page, '.wsjgraphics');
      await browser.close();

      const fallbackDimensions = sizeOf(`${filePath}/fallback.png`);

      inset.platforms.push('mobile');
      inset.alt = {
        render: {src: `https://graphics.wsj.com/dynamic-inset-iframer/?url=https://asset.wsj.net/wsjnewsgraphics/dice/${DATA.slug}/inset.json`},
        text: null,
        link: '#',
        picture: {
          sources: [{
            media: '4u',
            srcset: fallbackPath,
            width: fallbackDimensions.width/2,
            height: fallbackDimensions.height/2
          }],
          img: {
            src: fallbackPath,
            type: 'graphic',
            width: fallbackDimensions.width/2,
            height: fallbackDimensions.height/2
          }
        }
      };

      const space = isProduction ? null : '\t';

      fs.writeFile(`${filePath}/inset.json`, JSON.stringify(inset, null, space), 'utf8', err => {
        if(err) reject('error saving file');
        console.log(colors.green('Fallback image created and added to inset.'));
        resolve();
      });
    } else {
      console.log(colors.gray('Fallback image screenshot disabled.'));
      resolve();
    }
    });
}

if (argv.buildInset) {
  console.log(colors.blue('Preparing inset build...'));
  generateInset(argv.production).then(() => console.log(colors.green('Inset build complete.')));
}

if (argv.buildFallback) {
  console.log(colors.blue('Preparing fallback image...'));
  //start up a fresh http server
  const { spawn } = require('child_process');
  const server = spawn('http-server -p 3001',{
    stdio: ['pipe', 'pipe', process.stderr],
    shell: true
  });
  server.stdout.on('data',(data) => {
    if(data.toString() === 'Starting up http-server, serving ./\nAvailable on:\n') {
      generateFallback(argv.production,'3001').then(() => {
        server.kill();
        console.log(colors.green('Fallback image preparation complete.'));
      });
    }
  });
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
      generateInset().then(() => {
        console.log(colors.green('Rebuild complete.'));
        generateFallback().then(() => console.log(colors.green('Fallback screenshot created.')));
      });
    });
}

if (argv.deploy) {
  const DATA = JSON.parse(fs.readFileSync('./inset/data.json', 'utf8'));
  console.log(colors.blue('Preparing deployment...'));

  if (!DATA.slug) return console.log(colors.red('Please add a slug to `src/config.json`.'));

  if (DATA.slug = "blah-10f9f3d1-993d-4c37-8db0-866dbc762272") return console.log(colors.red('Please create a unique slug in `inset/data.json`'));

  // gather files to deploy
  const files = fs.readdirSync('dist/remote');

  // create requests
  const promises = files.map(file => {
    return request
      .post(`http://int.production.file-uploader.virginia.dj01.onservo.com/api/v2/dice/${DATA.slug}/${file}`)
      .attach('file', `dist/remote/${file}`);
  });

  // send requests
  Promise.all(promises)
    .then(responses => {
      responses
        .filter(response => /inset.json/ig.test(response.body.urls.cached))
        .forEach(response => {
          console.log('\n----------');
          console.log('Inset URLs');
          console.log(prettyjson.render(response.body.urls));
          console.log('----------\n');
        });

      console.log(colors.blue('Deployment completed.'));
    })
    .catch(error => {
      console.log(colors.red(error));
    });


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
