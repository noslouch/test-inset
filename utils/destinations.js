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

module.exports = destinations;