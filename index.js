const Request = require('request-promise');
const PQueue = require('p-queue');
const categorizeUrls = require('./src/categorize-urls');
const extractUrls = require('./src/extract-urls');

const URL = process.argv[2].trim();
const SCANNED_EXTERNAL_LINKS_LIMIT = 90;

const queue = new PQueue({concurrency: 5});
const followedLinks = {};
const externalUrls = [];
let shouldRun = true;

queue.on('active', () => {
  if (externalUrls.length >= SCANNED_EXTERNAL_LINKS_LIMIT) {
    shouldRun = false;
  }
});

const processUrl = (url) => {
  if(!shouldRun) {
    queue.clear();
    return;
  }

  followedLinks[url] = true;

  queue.add(
    () => Request(url)
      .then(html => {
        const urls = categorizeUrls(extractUrls(html, url), url);
        urls.internal.forEach(url => processUrl(url.url));
        urls.external.forEach(url => externalUrls.push(url));
      })
      .catch(err => {
        followedLinks[url] = false;
        console.error(`Failed to fetch '${url}': ${err}`, err);
      }),
  );
};

processUrl(URL);

queue.onIdle().then(() => {
  const allCount = externalUrls.length;
  const dofollowCount = externalUrls.filter(url => url.dofollow).length;
  const nofollowCount = allCount - dofollowCount;
  console.log(`${URL}, ${dofollowCount}, ${nofollowCount}, ${allCount}`);
});
