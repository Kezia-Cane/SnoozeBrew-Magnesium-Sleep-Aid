const { chromium } = require("playwright");
const path = require("path");
const assert = require("assert");

function countColumns(gridTemplateColumns) {
  return gridTemplateColumns.split(" ").filter(Boolean).length;
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const fileUrl =
    "file:///" +
    path
      .resolve("C:/Users/Administrator/Documents/My projects/Snooze Brew/index.html")
      .replace(/\\/g, "/");

  async function capture(width) {
    const page = await browser.newPage({ viewport: { width, height: 1600 } });
    await page.goto(fileUrl);
    await page.waitForSelector(".product-page__inner");

    const info = await page.evaluate(() => {
      const reviewThumb = document.querySelector(".reviews-showcase__thumb");
      const reviewThumbRect = reviewThumb ? reviewThumb.getBoundingClientRect() : null;

      return {
        productCols: getComputedStyle(document.querySelector(".product-page__inner")).gridTemplateColumns,
        faqCols: getComputedStyle(document.querySelector(".faq-grid")).gridTemplateColumns,
        desktopGalleryDisplay: getComputedStyle(document.querySelector(".gallery-desktop-grid")).display,
        mobileGalleryDisplay: getComputedStyle(document.querySelector(".gallery-mobile-shell")).display,
        navDisplay: getComputedStyle(document.querySelector(".site-nav")).display,
        socialCols: getComputedStyle(document.querySelector(".social-collage")).gridTemplateColumns,
        mobileFirstSlideSrc: document.querySelector('.gallery-slide[data-index="0"] img')?.getAttribute("src"),
        mobileFirstThumbSrc: document.querySelector('.gallery-thumb[data-index="0"] img')?.getAttribute("src"),
        reviewThumbWidth: reviewThumbRect ? Math.round(reviewThumbRect.width) : 0,
        reviewThumbHeight: reviewThumbRect ? Math.round(reviewThumbRect.height) : 0
      };
    });

    await page.close();
    return info;
  }

  const desktop = await capture(1366);
  const narrowDesktop = await capture(1161);
  const tablet = await capture(900);
  const mobile = await capture(390);

  assert.strictEqual(countColumns(desktop.productCols), 2, "expected desktop to keep Jiyu's two-column product layout");
  assert.strictEqual(countColumns(tablet.productCols), 1, "expected tablet to collapse the product layout like Jiyu");
  assert.strictEqual(countColumns(mobile.productCols), 1, "expected mobile to remain a single-column product layout");

  assert.strictEqual(countColumns(desktop.faqCols), 2, "expected desktop FAQ to remain two columns");
  assert.strictEqual(countColumns(tablet.faqCols), 1, "expected tablet FAQ to collapse to one column");
  assert.strictEqual(countColumns(mobile.faqCols), 1, "expected mobile FAQ to remain one column");

  assert.strictEqual(desktop.desktopGalleryDisplay !== "none", true, "expected desktop gallery grid to stay visible on desktop");
  assert.strictEqual(desktop.mobileGalleryDisplay, "none", "expected mobile gallery shell to stay hidden on desktop");
  assert.strictEqual(tablet.desktopGalleryDisplay, "none", "expected desktop gallery grid to hide on tablet");
  assert.strictEqual(tablet.mobileGalleryDisplay !== "none", true, "expected mobile gallery shell to take over on tablet");
  assert.strictEqual(mobile.desktopGalleryDisplay, "none", "expected desktop gallery grid to hide on mobile");
  assert.strictEqual(mobile.mobileGalleryDisplay !== "none", true, "expected mobile gallery shell to stay visible on mobile");

  assert.strictEqual(desktop.navDisplay, "flex", "expected desktop navigation to remain visible");
  assert.strictEqual(narrowDesktop.navDisplay, "flex", "expected narrow desktop navigation to remain visible");
  assert.strictEqual(tablet.navDisplay, "none", "expected tablet navigation to switch to the hamburger layout");
  assert.strictEqual(mobile.navDisplay, "none", "expected mobile navigation to switch to the hamburger layout");

  assert.strictEqual(narrowDesktop.reviewThumbWidth, 58, "expected the narrow desktop review thumbnails to stay compact");
  assert.strictEqual(narrowDesktop.reviewThumbHeight, 58, "expected the narrow desktop review thumbnails to stay compact");

  assert.strictEqual(
    tablet.mobileFirstSlideSrc,
    "assets/images/2ab997b7ee4ba4684b90975f621101f8_1765589584_1060x.png",
    "expected tablet responsive gallery to lead with the promo mug image"
  );
  assert.strictEqual(
    mobile.mobileFirstSlideSrc,
    "assets/images/2ab997b7ee4ba4684b90975f621101f8_1765589584_1060x.png",
    "expected mobile responsive gallery to lead with the promo mug image"
  );
  assert.strictEqual(
    tablet.mobileFirstThumbSrc,
    "assets/images/2ab997b7ee4ba4684b90975f621101f8_1765589584_200x@2x.png",
    "expected tablet responsive gallery thumbnails to start with the promo mug image"
  );
  assert.strictEqual(
    mobile.mobileFirstThumbSrc,
    "assets/images/2ab997b7ee4ba4684b90975f621101f8_1765589584_200x@2x.png",
    "expected mobile responsive gallery thumbnails to start with the promo mug image"
  );

  assert.strictEqual(countColumns(desktop.socialCols), 3, "expected desktop social collage to keep its three-column composition");
  assert.strictEqual(countColumns(tablet.socialCols), 2, "expected tablet social collage to collapse to the Jiyu two-column state");
  assert.strictEqual(mobile.socialCols, "none", "expected mobile social collage to stack instead of using a grid template");

  console.log("PASS desktop, tablet, and mobile responsive states match the intended Jiyu-style behavior");
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
