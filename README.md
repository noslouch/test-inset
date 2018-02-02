# dice


## Table of Contents


## Installation
The next section is installation. Tell users how to install your project locally. Include a code example if desired, like this:
```sh
# install dependencies
$ npm install
```

## Usage
```sh
# run local server and watch for inset/ and src/ changes
$ npm start

# build and deploy
$ npm run deploy
```



### `npm start`
- starts `http-server` on port `3000`
- watch `src/` and `inset/` for changes
- builds `src/` to `dist/local/*`
- builds `inset/` to `dist/local/inset.json`

### `npm run deploy`
- cleans `dist/remote/*
- builds `src/` to `dist/remote/*`
- builds `inset/` to `dist/remote/inset.json`
- deploy assets to s3: `https://asset.wsj.net/wsjnewsgraphics/dice/slug/*`


## Examples

Preview your inset at the urls below
- `http://127.0.0.1:3000/article-standard.html`
- `http://127.0.0.1:3000/article-immersive.html`

## Contact
Need Assistance? Email [tools@wsj.com](mailto:tools@wsj.com).
