# Dice

**D**ynamic **I**nset **C**reation **E**quipment

## Table of Contents
* [Setup](#setup)
* [Viewing locally](#viewing-locally)
* [Installing libraries](#installing-libraries)
* [Deploying](#deploying)
* [Contact](#contact)

## Setup

1. Clone a fresh copy (make sure to replace `NAME_OF_PROJECT`):

    ```sh
    git clone https://github.dowjones.net/skunkworks/dice.git NAME-OF-PROJECT
    ```

2. Make sure you have Node >= 6.0 installed ([Node installer is here](https://nodejs.org/)). Then install dependencies:

    ```sh
    npm install
    ```

3. Run a local server and compile the inset:

    ```sh
    npm start
    ```

    What this does:

    - starts `http-server` on port `3000`
    - watch `src/` and `inset/` for changes
    - builds `src/` to `dist/local/*`
    - builds `inset/` to `dist/local/inset.json`

## Viewing locally

Once you’re running `npm start`, preview your inset at the urls below:

- http://127.0.0.1:3000/article-standard.html
- http://127.0.0.1:3000/article-immersive.html

## Installing libraries

All libraries should be installed with NPM and bundled using Webpack.

Here are a few examples:

### D3 and [d3wsj](https://github.dowjones.net/WSJNewsGraphics/d3wsj/)

On the command line:

```bash
npm install d3 --save
npm install git+https://github.dowjones.net/WSJNewsGraphics/d3-wsj.git --save
```

In your JavaScript:

```js
import * as d3 from 'd3';
import d3wsj from 'd3wsj';
```

### [wsjgraphics.css](https://github.dowjones.net/bentleye/wsjgraphics.css/) (buttons, chart styles, colors, etc)

On the command line:

```bash
npm install git+https://github.dowjones.net/bentleye/wsjgraphics.css.git --save
```

In your SCSS file:

```scss
@import '~wsjgraphics-css/index.css';
```

## Deploying

Before deploying, make sure that:

- code is fully pushed to GitHub
- preview pages look ok
- `slug` has been set in `inset/data.json`
  - the format should be `project-name-uuid` -> `foobar-9c4341b7-f216-49fc-8fed-4aca7d6ad0c1`
  - grab a uuid [here](https://www.uuidgenerator.net/)

To deploy your inset to S3, run this:

```sh
npm run deploy
```

When done, the deploy script will show the production inset URL. It will always write to the same location (assuming the slug doesn’t change).

What this script does:

- cleans `dist/remote/*
- builds `src/` to `dist/remote/*`
- builds `inset/` to `dist/remote/inset.json`
- deploy assets to s3: `https://asset.wsj.net/wsjnewsgraphics/dice/slug/*`

## Contact

Need Assistance? Email [tools@wsj.com](mailto:tools@wsj.com).
