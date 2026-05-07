const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const repoRoot = path.resolve(__dirname, "..");
const scriptSource = fs.readFileSync(path.join(repoRoot, "script.js"), "utf8");
const vercelConfigPath = path.join(repoRoot, "vercel.json");
const htmlFiles = [
  "index.html",
  "about.html",
  "contact.html",
  "faq.html",
  "shipping.html",
  "refund.html",
  "privacy.html",
  "terms.html",
  "checkout.html"
];

const expectedRoutes = {
  one_time: {
    buy1: "https://snoozebrew.silmea.com/snoozebrewbuy1",
    buy1get1free: "https://snoozebrew.silmea.com/snoozebrewbuy1getfree",
    buy2get2free: "https://snoozebrew.silmea.com/snoozebrewbuy2get2free"
  },
  subscription: {
    buy1: "https://snoozebrew.silmea.com/snoozebrewbuy1save30monthlydelivery",
    buy1get1free: "https://snoozebrew.silmea.com/snoozebrewbuy1get1freesave30monthlydelivery",
    buy2get2free: "https://snoozebrew.silmea.com/snoozebrewbuy2get2freesave30monthlydelivery"
  }
};

class FakeClassList {
  constructor(initialClasses) {
    this.classes = new Set(initialClasses || []);
  }

  add(name) {
    this.classes.add(name);
  }

  remove(name) {
    this.classes.delete(name);
  }

  contains(name) {
    return this.classes.has(name);
  }

  toggle(name, force) {
    if (typeof force === "boolean") {
      if (force) {
        this.classes.add(name);
        return true;
      }

      this.classes.delete(name);
      return false;
    }

    if (this.classes.has(name)) {
      this.classes.delete(name);
      return false;
    }

    this.classes.add(name);
    return true;
  }
}

class FakeElement {
  constructor(config) {
    const options = config || {};

    this.id = options.id || "";
    this.tagName = options.tagName || "DIV";
    this.dataset = { ...(options.dataset || {}) };
    this.textContent = options.textContent || "";
    this.style = {};
    this.hidden = Boolean(options.hidden);
    this.disabled = Boolean(options.disabled);
    this.checked = Boolean(options.checked);
    this.src = options.src || "";
    this.href = options.href || "";
    this.attributes = {};
    this.listeners = {};
    this.selectorMap = { ...(options.selectorMap || {}) };
    this.classList = new FakeClassList(options.classNames || []);
  }

  addEventListener(type, handler) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    this.listeners[type].push(handler);
  }

  dispatchEvent(event) {
    const listeners = this.listeners[event.type] || [];

    listeners.forEach((handler) => {
      handler.call(this, event);
    });

    return !event.defaultPrevented;
  }

  querySelector(selector) {
    return this.selectorMap[selector] || null;
  }

  querySelectorAll(selector) {
    const result = this.selectorMap[selector];
    return Array.isArray(result) ? result : [];
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  getAttribute(name) {
    return this.attributes[name];
  }

  closest() {
    return null;
  }

  scrollIntoView() {}

  scrollBy() {}

  scrollTo() {}

  getBoundingClientRect() {
    return { top: 0, bottom: 0, height: 0, width: 0 };
  }
}

function createJarOption(bundleKey, isSelected, dataset) {
  const current = new FakeElement({ classNames: ["price-current"] });
  const compare = new FakeElement({ classNames: ["price-compare"] });
  const daily = new FakeElement({ classNames: ["price-daily"] });

  return new FakeElement({
    tagName: "BUTTON",
    classNames: ["jar-option"].concat(isSelected ? ["selected"] : []),
    dataset: {
      bundle: bundleKey,
      image: "assets/products/" + bundleKey + ".png",
      ...dataset
    },
    selectorMap: {
      ".price-current": current,
      ".price-compare": compare,
      ".price-daily": daily
    }
  });
}

function createHarness() {
  const jarOptions = [
    createJarOption("buy1", false, {
      jar: "1",
      discount: "30"
    }),
    createJarOption("buy1get1free", true, {
      jar: "2",
      discount: "30"
    }),
    createJarOption("buy2get2free", false, {
      jar: "3",
      discount: "30"
    })
  ];
  const autoRefillToggle = new FakeElement({
    id: "auto-refill-toggle",
    tagName: "INPUT",
    checked: true
  });
  const autoRefillTitle = new FakeElement({ id: "auto-refill-title" });
  const autoRefillSub = new FakeElement({ classNames: ["auto-refill__sub"] });
  const addToCartBtn = new FakeElement({
    id: "add-to-cart",
    tagName: "BUTTON",
    dataset: {
      checkoutCta: "",
      purchaseType: "subscription",
      bundle: "buy1get1free",
      checkoutUrl: "#product-info"
    }
  });
  const mobileAddToCartBtn = new FakeElement({
    id: "mobile-add-to-cart",
    tagName: "BUTTON",
    dataset: {
      checkoutCta: "",
      purchaseType: "subscription",
      bundle: "buy1get1free",
      checkoutUrl: "#product-info"
    }
  });
  const desktopVariantMedia = new FakeElement({
    id: "desktop-variant-media",
    tagName: "IMG"
  });
  const body = new FakeElement({ tagName: "BODY" });
  let domReadyHandler = null;

  const document = {
    body,
    documentElement: {
      clientHeight: 900
    },
    addEventListener(type, handler) {
      if (type === "DOMContentLoaded") {
        domReadyHandler = handler;
      }
    },
    querySelector(selector) {
      if (selector === ".auto-refill__sub") {
        return autoRefillSub;
      }

      return null;
    },
    querySelectorAll(selector) {
      if (selector === ".jar-option") {
        return jarOptions;
      }

      if (selector === "[data-checkout-cta]") {
        return [addToCartBtn, mobileAddToCartBtn];
      }

      return [];
    },
    getElementById(id) {
      const elements = {
        "auto-refill-toggle": autoRefillToggle,
        "auto-refill-title": autoRefillTitle,
        "add-to-cart": addToCartBtn,
        "desktop-variant-media": desktopVariantMedia
      };

      return elements[id] || null;
    }
  };

  const window = {
    document,
    location: { href: "about:blank" },
    innerWidth: 1366,
    addEventListener() {},
    setInterval() {
      return 1;
    },
    clearInterval() {},
    requestAnimationFrame() {}
  };

  const context = {
    window,
    document,
    console,
    setInterval: window.setInterval,
    clearInterval: window.clearInterval,
    requestAnimationFrame: window.requestAnimationFrame,
    Event: function Event(type, options) {
      this.type = type;
      this.bubbles = Boolean(options && options.bubbles);
      this.defaultPrevented = false;
      this.preventDefault = () => {
        this.defaultPrevented = true;
      };
    }
  };

  vm.createContext(context);
  vm.runInContext(scriptSource, context);

  assert.ok(domReadyHandler, "expected script.js to register a DOMContentLoaded handler");
  domReadyHandler();

  return {
    addToCartBtn,
    autoRefillSub,
    autoRefillTitle,
    autoRefillToggle,
    jarOptions,
    mobileAddToCartBtn,
    window
  };
}

function click(element) {
  const event = {
    type: "click",
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    }
  };

  element.dispatchEvent(event);
}

function change(element) {
  const event = {
    type: "change",
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    }
  };

  element.dispatchEvent(event);
}

function assertLandingPageHasNoHardcodedGhlLinks() {
  const contents = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
  const ghlUrlPattern = /https:\/\/snoozebrew\.silmea\.com\/[^"'\s<>]*/i;
  const addToCartPattern = /<button[^>]*id="add-to-cart"[^>]*>/i;
  const addToCartMatch = contents.match(addToCartPattern);

  assert.strictEqual(
    ghlUrlPattern.test(contents),
    false,
    "expected index.html to keep GHL URLs out of the landing page markup"
  );
  assert.ok(addToCartMatch, "expected index.html to include the Add to Cart button");
  assert.strictEqual(
    /\shref=/.test(addToCartMatch[0]),
    false,
    "expected Add to Cart to be controlled by JavaScript, not href"
  );
  assert.strictEqual(
    /\sdata-checkout-url=/.test(addToCartMatch[0]),
    false,
    "expected Add to Cart to avoid hardcoded checkout URLs in data attributes"
  );
}

function assertPublishedPagesUseCleanInternalUrls() {
  const internalHtmlHrefPattern = /href="(?:index|about|faq|contact|privacy|terms|shipping|refund|checkout)\.html(?:#[^"]*)?"/i;
  const staleCheckoutDomainPattern = /https:\/\/(?:www\.)?trysnoozebrew\.com|https:\/\/(?:www\.)?trysnoozebrew\.silmea\.com/i;

  htmlFiles.forEach((fileName) => {
    const contents = fs.readFileSync(path.join(repoRoot, fileName), "utf8");

    assert.strictEqual(
      internalHtmlHrefPattern.test(contents),
      false,
      "expected " + fileName + " to use clean internal page URLs instead of .html paths"
    );
    assert.strictEqual(
      staleCheckoutDomainPattern.test(contents),
      false,
      "expected " + fileName + " to remove stale published domains"
    );
  });
}

function assertVercelCleanRouteConfig() {
  assert.ok(
    fs.existsSync(vercelConfigPath),
    "expected vercel.json to exist so clean published routes resolve to the HTML files"
  );

  const config = JSON.parse(fs.readFileSync(vercelConfigPath, "utf8"));
  const requiredRoutes = {
    "/about": "/about.html",
    "/faq": "/faq.html",
    "/privacy": "/privacy.html",
    "/terms": "/terms.html",
    "/shipping": "/shipping.html",
    "/refund": "/refund.html",
    "/contact": "/contact.html",
    "/checkout": "/checkout.html"
  };
  const rewrites = Array.isArray(config.rewrites) ? config.rewrites : [];
  const redirects = Array.isArray(config.redirects) ? config.redirects : [];

  Object.entries(requiredRoutes).forEach(([source, destination]) => {
    assert.ok(
      rewrites.some((rewrite) => rewrite.source === source && rewrite.destination === destination),
      "expected vercel.json to rewrite " + source + " to " + destination
    );

    assert.ok(
      redirects.some((redirect) => redirect.source === destination && redirect.destination === source),
      "expected vercel.json to redirect " + destination + " to " + source
    );
  });
}

function assertRedirectsFollowBundleSelection() {
  const harness = createHarness();
  const {
    addToCartBtn,
    autoRefillSub,
    autoRefillTitle,
    autoRefillToggle,
    jarOptions,
    mobileAddToCartBtn,
    window
  } = harness;

  assert.strictEqual(autoRefillTitle.textContent, "Save 30% with Monthly Delivery");
  assert.strictEqual(autoRefillSub.textContent, "Cancel Anytime – No Commitment");
  assert.strictEqual(addToCartBtn.dataset.checkoutUrl, expectedRoutes.subscription.buy1get1free);

  const scenarios = [
    { optionIndex: 0, subscription: false, expectedUrl: expectedRoutes.one_time.buy1 },
    { optionIndex: 1, subscription: false, expectedUrl: expectedRoutes.one_time.buy1get1free },
    { optionIndex: 2, subscription: false, expectedUrl: expectedRoutes.one_time.buy2get2free },
    { optionIndex: 0, subscription: true, expectedUrl: expectedRoutes.subscription.buy1 },
    { optionIndex: 1, subscription: true, expectedUrl: expectedRoutes.subscription.buy1get1free },
    { optionIndex: 2, subscription: true, expectedUrl: expectedRoutes.subscription.buy2get2free }
  ];

  scenarios.forEach((scenario) => {
    autoRefillToggle.checked = scenario.subscription;
    change(autoRefillToggle);
    click(jarOptions[scenario.optionIndex]);

    [addToCartBtn, mobileAddToCartBtn].forEach((cta) => {
      window.location.href = "about:blank";
      click(cta);

      assert.strictEqual(
        cta.dataset.checkoutUrl,
        scenario.expectedUrl,
        "expected CTA dataset to track the selected route"
      );
      assert.strictEqual(
        window.location.href,
        scenario.expectedUrl,
        "expected every Add to Cart CTA to redirect to the selected GHL checkout route"
      );
    });
  });
}

assertLandingPageHasNoHardcodedGhlLinks();
assertPublishedPagesUseCleanInternalUrls();
assertVercelCleanRouteConfig();
assertRedirectsFollowBundleSelection();

console.log("PASS published pages use clean internal URLs and every Add to Cart CTA redirects to the selected bundle/subscription route");
