const Url = require('url');

/**
 * @param {Array.<{url: string, dofollow: boolean}>} urls
 * @param {string} currentUrl
 * @returns {{internal: Array.<{url: string, dofollow: boolean}>, external: Array.<{url: string, dofollow: boolean}>}}
 */
module.exports = function(urls, currentUrl) {
  const currentDomain = Url.parse(currentUrl).hostname;
  const internal = [], external = [];

  urls.forEach(url => {
    const domain = Url.parse(url.url).hostname;

    if(domain === currentDomain) {
      internal.push(url);
    } else {
      external.push(url);
    }
  });

  return {internal, external};
};
