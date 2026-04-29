const { chromium } = require("playwright");
const path = require("path");
const assert = require("assert");

(async () => {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const page = await browser.newPage({ viewport: { width: 1366, height: 1600 } });
  const fileUrl =
    "file:///" +
    path
      .resolve("C:/Users/Administrator/Documents/My projects/Snooze Brew/index.html")
      .replace(/\\/g, "/");

  await page.goto(fileUrl);
  await page.waitForSelector(".product-page__inner");

  const data = await page.evaluate(() => {
    const requiredSelectors = [
      ".announcement-bar",
      ".site-header",
      ".product-page",
      ".product-gallery",
      ".product-info",
      ".benefit-strip",
      ".real-results",
      ".clinical-ingredients",
      ".how-different",
      ".reviews-showcase",
      ".faq-section",
      ".social-section",
      ".newsletter-section",
      ".site-footer",
      "#ingredients-modal"
    ];

    const missing = requiredSelectors.filter((selector) => !document.querySelector(selector));
    const visibleText = document.body.innerText;
    const mediaSources = Array.from(document.querySelectorAll("img[src], source[src]"))
      .map((node) => node.getAttribute("src"))
      .filter(Boolean);
    const selectorImages = Array.from(document.querySelectorAll(".jar-option__image img"))
      .map((node) => node.getAttribute("src"));
    const videoSources = Array.from(document.querySelectorAll(".video-thumbs-row source, .social-section source"))
      .map((node) => node.getAttribute("src"));

    return {
      missing,
      gallerySlides: document.querySelectorAll(".gallery-slide").length,
      jarOptions: document.querySelectorAll(".jar-option").length,
      ingredientCards: document.querySelectorAll(".ingredient-card").length,
      faqItems: document.querySelectorAll(".faq-item").length,
      hasJiyuText: /jiyu|renewal\s*&\s*rejuvenation|toner pads/i.test(visibleText),
      hasRemoteJiyuMedia: mediaSources.some((src) => /jiyuskin|felinebloom/i.test(src)),
      selectorImagesAreLocal: selectorImages.every((src) => src.includes("assets/products/")),
      videosAreLocal: videoSources.every((src) => src.includes("assets/vidoes/"))
    };
  });

  assert.deepStrictEqual(data.missing, [], "expected Snooze page to keep the full Jiyu section sequence");
  assert.strictEqual(data.gallerySlides, 12, "expected the Jiyu mobile gallery structure with 12 slides");
  assert.strictEqual(data.jarOptions, 3, "expected the Jiyu-style 3-option product selector");
  assert.strictEqual(data.ingredientCards, 8, "expected the ingredient highlight rail to preserve its 8-card layout");
  assert.strictEqual(data.faqItems, 13, "expected the FAQ section to preserve the full Jiyu-style question volume");
  assert.strictEqual(data.hasJiyuText, false, "expected no Jiyu visible copy or old toner product text to remain");
  assert.strictEqual(data.hasRemoteJiyuMedia, false, "expected no Jiyu media or Feline Bloom routes to remain in the page DOM");
  assert.strictEqual(data.selectorImagesAreLocal, true, "expected product selector cards to use Snooze local assets/products images");
  assert.strictEqual(data.videosAreLocal, true, "expected product and social videos to use Snooze local assets/vidoes media");

  console.log("PASS Snooze page keeps the Jiyu section system while using Snooze-only visible content and assets");
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
