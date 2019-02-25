const extractUrls = require('../src/extract-urls');

test('given HTML without URLs should return an empty array', () => {
  const html = `
  <body>
    <div>dummy</div>
  </body>
  `;

  const extracted = extractUrls(html);

  expect([]).toEqual(extracted);
});

test('given HTML with URLs should extract them', () => {
  const urls = [
    'http://example.com/',
    'https://example.com/?q=s',
    'https://www.example.com/?q=s&2=1',
  ];
  const html = `
  <body>
    <a href="${urls[0]}"></a>
    <a href="${urls[1]}"></a>
    <a href="${urls[2]}"></a>
  </body>
  `;

  const extracted = extractUrls(html);

  expect(extracted.map(u => u.url).sort()).toEqual(urls.sort());
});

test('given URL with no attributes it should be dofollow', () => {
  const url = 'http://example.com/';
  const html = `
  <body>
    <a href="${url}"></a>
  </body>
  `;

  const extracted = extractUrls(html);

  expect(extracted[0].dofollow).toEqual(true);
});

test('given URL with rel="nofollow" attribute it should not be dofollow', () => {
  const url = 'http://example.com/';
  const html = `
  <body>
    <a href="${url}" rel="nofollow"></a>
  </body>
  `;

  const extracted = extractUrls(html);

  expect(extracted[0].dofollow).toEqual(false);
});
