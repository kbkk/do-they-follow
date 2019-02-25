const Cheerio = require('cheerio');
const Url = require('url');

/**
 * @param {string} html
 * @param {string} baseUrl
 * @returns {Array.<{url: string, dofollow: boolean}>}
 */
module.exports = function(html, baseUrl) {
  const $ = Cheerio.load(html);
  const urls = $('a')
    .map(function(index, elem) {
      const $a = $(this);
      const url = $a.attr('href');
      const dofollow = $a.attr('rel') !== 'nofollow';

      return {url, dofollow};
    })
    .get();

  return urls
    .filter(({url}) => typeof url === 'string')
    .filter(({url}) => {
      const meta = Url.parse(url);
      return ['http:', 'https:'].includes(meta.protocol);
    })
    .map(result => {
      result.url = Url.resolve(baseUrl, result.url);

      return result;
    });
};
