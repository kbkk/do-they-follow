const categorizeUrls = require('../src/categorize-urls');

test(
  'given URLs in same domain as currentUrl they should be categorized as internal',
  () => {
    const currentUrl = 'http://example.com/page/1';
    const urls = [
      {url: 'http://example.com/page/1', dofollow: true},
      {url: 'http://example.com/', dofollow: true},
      {url: 'https://example.com/?q=s', dofollow: true},
    ];

    const result = categorizeUrls(urls, currentUrl);

    expect(result.internal.length).toEqual(urls.length);
    expect(result.external.length).toEqual(0);
  },
);
