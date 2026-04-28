# SnoozeBrew Product Selector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Jiyu-style product-selection module to the existing SnoozeBrew purchase area with 3 visible cards, a monthly-delivery toggle, variant image swapping, and 6 total purchase states.

**Architecture:** Keep the page structure intact and replace only the top product CTA area with a self-contained selector block. Store one-time and monthly prices on each card as `data-*` attributes, let JavaScript switch the active price set and CTA text, and reuse the existing gallery image for variant swapping.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript

---

### Task 1: Add selector markup

**Files:**
- Modify: `C:/Users/Administrator/Documents/My projects/Snooze Brew/index.html`

- [ ] **Step 1: Add the selector section markup after the stock pill and before payment badges**

```html
<section class="sb-purchase-card" data-purchase-card>
  <div class="sb-purchase-heading">
    <p class="sb-purchase-kicker">Choose your supply and save</p>
  </div>
  <div class="sb-variant-options" id="sb-variant-options">
    <!-- 3 option buttons with pricing data -->
  </div>
  <label class="sb-subscribe-toggle" for="sb-subscribe-toggle">
    <!-- checkbox + 20% copy -->
  </label>
  <button class="sb-primary-btn sb-selector-cta" id="sb-selector-cta" type="button">
    <span class="sb-bag-mini" aria-hidden="true"></span>
    <span>ADD TO CART</span>
  </button>
</section>
```

- [ ] **Step 2: Ensure each option includes exact behavior data**

```html
<button
  class="sb-variant-option"
  type="button"
  data-bundle="buy1"
  data-image="assets/products/1.png"
  data-regular="51.99"
  data-regular-compare=""
  data-regular-daily="1.73"
  data-subscription="41.59"
  data-subscription-compare="51.99"
  data-subscription-daily="1.39">
</button>
```

### Task 2: Style the selector

**Files:**
- Modify: `C:/Users/Administrator/Documents/My projects/Snooze Brew/style.css`

- [ ] **Step 1: Add a dedicated block of selector styles near the current product CTA styles**

```css
.sb-purchase-card {
  border: 1px solid rgba(107, 54, 138, 0.14);
  border-radius: 22px;
  background: linear-gradient(180deg, #fffdfd 0%, #fbf6ff 100%);
}
```

- [ ] **Step 2: Add responsive rules for stacked mobile cards and toggle spacing**

```css
@media (max-width: 989px) {
  .sb-variant-grid {
    grid-template-columns: 1fr;
  }
}
```

### Task 3: Wire the behavior

**Files:**
- Modify: `C:/Users/Administrator/Documents/My projects/Snooze Brew/script.js`

- [ ] **Step 1: Add a purchase-selector initializer**

```js
function initPurchaseSelector() {
  var options = Array.prototype.slice.call(document.querySelectorAll(".sb-variant-option"));
  var toggle = document.getElementById("sb-subscribe-toggle");
  var cta = document.getElementById("sb-selector-cta");
}
```

- [ ] **Step 2: Update selected card, visible prices, monthly copy, and CTA text from card data**

```js
function renderSelectedState() {
  var useSubscription = toggle && toggle.checked;
  var price = useSubscription ? option.dataset.subscription : option.dataset.regular;
}
```

- [ ] **Step 3: Reuse the existing gallery image element for variant swapping**

```js
var image = document.querySelector("[data-gallery-image]");
if (image) {
  image.src = selectedOption.getAttribute("data-image");
}
```

- [ ] **Step 4: Initialize the selector on DOM ready**

```js
document.addEventListener("DOMContentLoaded", function () {
  initPurchaseSelector();
});
```

### Task 4: Verify behavior

**Files:**
- Verify: `C:/Users/Administrator/Documents/My projects/Snooze Brew/index.html`

- [ ] **Step 1: Open the page and verify default state**

Run: open `file:///C:/Users/Administrator/Documents/My%20projects/Snooze%20Brew/index.html`
Expected: 3 cards render in the product area and the middle option is selected by default.

- [ ] **Step 2: Toggle monthly delivery and confirm pricing changes**

Expected: the checkbox switches all 3 cards from one-time prices to 20%-off monthly prices and updates the CTA to a save-20% message.

- [ ] **Step 3: Click each card and confirm image swapping**

Expected: the main gallery image updates to `assets/products/1.png`, `2.png`, or `3.png` based on the selected card.
