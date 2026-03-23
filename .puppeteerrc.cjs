const {join} = require('path');

module.exports = {
  // Yeh Puppeteer ko batayega ke Chrome ko project ke andar hi save kare
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
