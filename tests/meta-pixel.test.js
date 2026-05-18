const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");

const headMatch = indexHtml.match(/<head>([\s\S]*?)<\/head>/i);
assert.ok(headMatch, "expected index.html to include a head section");

const headContents = headMatch[1];

assert.match(
  headContents,
  /connect\.facebook\.net\/en_US\/fbevents\.js/i,
  "expected the Meta Pixel loader to be added to the landing page head"
);

assert.match(
  headContents,
  /fbq\('init',\s*'1643068040082206'\);/i,
  "expected the landing page to initialize Meta Pixel with the provided ID"
);

assert.match(
  headContents,
  /fbq\('track',\s*'PageView'\);/i,
  "expected the landing page to fire the standard Meta PageView event"
);

assert.match(
  indexHtml,
  /<noscript>\s*<img[^>]+src="https:\/\/www\.facebook\.com\/tr\?id=1643068040082206&ev=PageView&noscript=1"/i,
  "expected a noscript Meta Pixel fallback for PageView"
);

console.log("meta-pixel.test.js passed");
