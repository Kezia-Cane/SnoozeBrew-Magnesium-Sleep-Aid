const { chromium } = require("playwright");
const path = require("path");
const assert = require("assert");

function columnCount(gridTemplateColumns) {
  return gridTemplateColumns.split(" ").filter(Boolean).length;
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const fileUrl = "file:///" + path.resolve("C:/Users/Administrator/Documents/My projects/Snooze Brew/index.html").replace(/\\/g, "/");

  async function getLayout(width) {
    const page = await browser.newPage({ viewport: { width, height: 1200 } });
    await page.goto(fileUrl);
    await page.waitForSelector(".sb-purchase-card");
    const info = await page.evaluate(() => {
      const card = document.querySelector(".sb-variant-option .sb-variant-card");
      const badge = document.querySelector(".sb-variant-option .sb-variant-badge");
      const cardStyle = getComputedStyle(card);
      const badgeStyle = getComputedStyle(badge);

      return {
        gridTemplateColumns: cardStyle.gridTemplateColumns,
        badgeRight: badgeStyle.right
      };
    });
    await page.close();
    return info;
  }

  const mobile = await getLayout(390);
  const tablet = await getLayout(900);

  assert.strictEqual(
    columnCount(tablet.gridTemplateColumns),
    columnCount(mobile.gridTemplateColumns),
    "expected tablet cards to keep the same multi-column layout as mobile"
  );

  assert.strictEqual(
    tablet.badgeRight,
    mobile.badgeRight,
    "expected tablet badge positioning to match the mobile card design"
  );

  console.log("PASS purchase selector responsive layout matches between mobile and tablet");
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
