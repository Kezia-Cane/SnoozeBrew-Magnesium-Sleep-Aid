const assert = require('node:assert/strict');

const {
  buildTrackingPayload,
  normalizeVariant,
} = require('../ab-tracking.js');

assert.equal(normalizeVariant('b'), 'B');
assert.equal(normalizeVariant('   '), 'A');
assert.equal(normalizeVariant(undefined), 'A');

assert.deepEqual(
  buildTrackingPayload({
    event: 'page_view',
    testKey: 'snooze_brew_headline_v1',
    variant: 'b',
    pagePath: '/',
    pageUrl: 'https://snoozebrew.silmea.com/',
  }),
  {
    event: 'page_view',
    test_key: 'snooze_brew_headline_v1',
    variant: 'B',
    page_path: '/',
    page_url: 'https://snoozebrew.silmea.com/',
    timestamp: 'NOW',
  },
  'Tracking payload should normalize variants and preserve the active page URL.',
);

console.log('ab-tracking.test.js passed');
