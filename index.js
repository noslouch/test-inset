const path = require('path');
const fs = require('fs');
const minify = require('html-minifier').minify;
const argv = require('yargs').argv;

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
  generateInset().then(() => console.log('build complete'));
}
