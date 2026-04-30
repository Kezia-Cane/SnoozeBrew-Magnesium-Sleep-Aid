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
    const reviewVideos = Array.from(document.querySelectorAll(".reviews-showcase__thumb video"));
    const footerBottomText = Array.from(document.querySelectorAll(".footer-bottom p"))
      .map((node) => node.textContent.trim());
    const ingredientImageSources = Array.from(document.querySelectorAll(".ingredient-card .ingredient-img img"))
      .map((node) => node.getAttribute("src"));
    const subscriptionSnapshot = Array.from(document.querySelectorAll(".jar-option")).map((option) => ({
      current: option.querySelector(".price-current")?.textContent.trim(),
      compare: option.querySelector(".price-compare")?.textContent.trim(),
      daily: option.querySelector(".price-daily")?.textContent.trim()
    }));
    const subscriptionAutoRefillTitle = document.getElementById("auto-refill-title")?.textContent.trim();
    const subscriptionAutoRefillSub = document.querySelector(".auto-refill__sub")?.textContent.trim();

    const refillToggle = document.getElementById("auto-refill-toggle");

    if (refillToggle) {
      refillToggle.checked = false;
      refillToggle.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const oneTimeSnapshot = Array.from(document.querySelectorAll(".jar-option")).map((option) => ({
      current: option.querySelector(".price-current")?.textContent.trim(),
      compare: option.querySelector(".price-compare")?.textContent.trim(),
      compareVisible: getComputedStyle(option.querySelector(".price-compare")).display !== "none",
      daily: option.querySelector(".price-daily")?.textContent.trim()
    }));

    return {
      missing,
      gallerySlides: document.querySelectorAll(".gallery-slide").length,
      jarOptions: document.querySelectorAll(".jar-option").length,
      ingredientCards: document.querySelectorAll(".ingredient-card").length,
      faqItems: document.querySelectorAll(".faq-item").length,
      hasJiyuText: /jiyu|renewal\s*&\s*rejuvenation|toner pads/i.test(visibleText),
      hasRemoteJiyuMedia: mediaSources.some((src) => /jiyuskin|felinebloom/i.test(src)),
      selectorImagesAreLocal: selectorImages.every((src) => src.includes("assets/products/")),
      videosAreLocal: videoSources.every((src) => src.includes("assets/vidoes/")),
      comparisonHeroSrc: document.querySelector(".comp-hero-img")?.getAttribute("src"),
      comparisonBrandSrc: document.querySelector(".comp-brand-col .comp-product-img")?.getAttribute("src"),
      comparisonOtherSrc: document.querySelector(".comp-other-col .comp-product-img")?.getAttribute("src"),
      ingredientImageSources,
      reviewThumbVideos: reviewVideos.length,
      reviewThumbImages: document.querySelectorAll(".reviews-showcase__thumb img").length,
      reviewThumbsAreStatic: reviewVideos.every((video) => !video.controls && !video.autoplay && !video.loop),
      footerBottomText,
      addToCartBackground: getComputedStyle(document.getElementById("add-to-cart")).backgroundColor,
      subscriptionAutoRefillTitle,
      subscriptionAutoRefillSub,
      autoRefillTitle: document.getElementById("auto-refill-title")?.textContent.trim(),
      autoRefillSub: document.querySelector(".auto-refill__sub")?.textContent.trim(),
      subscriptionSnapshot,
      oneTimeSnapshot
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
  assert.strictEqual(
    data.comparisonHeroSrc,
    "assets/images/67d193cc252c976e4cbb49fab463ec20_1765597911_856x.png",
    "expected the comparison hero tile to use the requested local image"
  );
  assert.strictEqual(
    data.comparisonBrandSrc,
    "assets/products/ChatGPT Image Apr 30, 2026, 03_59_55 AM.png",
    "expected the SnoozeBrew comparison product shot to use the requested single-jar asset"
  );
  assert.strictEqual(
    data.comparisonOtherSrc,
    "https://assets.cdn.filesafe.space/LiPqlEzIjSLGJAzwjVeD/media/69e698c238381eafa8f3493f.png",
    "expected the other blends comparison product shot to use the requested remote asset"
  );
  assert.deepStrictEqual(
    data.ingredientImageSources,
    [
      "assets/ingredients/Dried_valerian_root_macro_photog…_202605010324.jpeg",
      "assets/ingredients/Leaves_in_oval_frame_202605010324.jpeg",
      "assets/ingredients/White_crystalline_powder_scatter…_202605010324.jpeg",
      "assets/ingredients/Griffonia_simplicifolia_seeds_te…_202605010324.jpeg",
      "assets/ingredients/Passionflower_petals_and_leaves_202605010324.jpeg",
      "assets/ingredients/Liquid_gel_with_ripples_202605010324.jpeg",
      "assets/ingredients/Water_droplets_on_smooth_surface_202605010324.jpeg",
      "assets/ingredients/White_silk_texture_oval_composition_202605010324.jpeg"
    ],
    "expected the ingredient cards to use the new local assets/ingredients image set in order"
  );
  assert.strictEqual(data.reviewThumbVideos, 8, "expected the reviews hero mosaic to use eight video thumbnails");
  assert.strictEqual(data.reviewThumbImages, 0, "expected the reviews hero mosaic to stop using still images");
  assert.strictEqual(data.reviewThumbsAreStatic, true, "expected the reviews hero mosaic videos to remain static thumbnails");
  assert.deepStrictEqual(
    data.footerBottomText,
    [
      "Silmea LLC",
      "5830 E 2nd Street Suite 7000, Unit #78521 Casper",
      "WY 82609 USA"
    ],
    "expected the footer bottom copy to be replaced with the requested address block"
  );
  assert.strictEqual(
    data.addToCartBackground,
    "rgb(74, 47, 126)",
    "expected the add-to-cart button to use the violet brand color"
  );
  assert.strictEqual(
    data.subscriptionAutoRefillTitle,
    "Save 30% with Monthly Delivery",
    "expected the checked refill label to advertise the 30% monthly discount"
  );
  assert.strictEqual(
    data.subscriptionAutoRefillSub,
    "Cancel Anytime – No Commitment",
    "expected the checked refill helper copy to stay intact"
  );
  assert.strictEqual(
    data.autoRefillTitle,
    "One-Time Purchase",
    "expected the refill header to switch to the one-time label after toggling off subscription"
  );
  assert.strictEqual(
    data.autoRefillSub,
    "No automatic refills",
    "expected the refill helper copy to switch after toggling off subscription"
  );
  assert.deepStrictEqual(
    data.subscriptionSnapshot,
    [
      { current: "$36.39", compare: "$51.99", daily: "$1.21 per day" },
      { current: "$36.39", compare: "$51.99", daily: "$0.61 per day" },
      { current: "$62.99", compare: "$89.99", daily: "$0.52 per day" }
    ],
    "expected the checked refill state to apply a full 30% discount to the monthly-delivery pricing"
  );
  assert.deepStrictEqual(
    data.oneTimeSnapshot,
    [
      { current: "$51.99", compare: "", compareVisible: false, daily: "$1.73 per day" },
      { current: "$51.99", compare: "", compareVisible: false, daily: "$0.87 per day" },
      { current: "$89.99", compare: "", compareVisible: false, daily: "$0.75 per day" }
    ],
    "expected the one-time purchase state to keep the original non-discounted pricing"
  );

  console.log("PASS Snooze page keeps the Jiyu section system while using Snooze-only visible content and assets");
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
