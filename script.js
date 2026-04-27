(function () {
  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateCountdown() {
    var countdowns = document.querySelectorAll("[data-countdown]");
    if (!countdowns.length) return;

    var now = new Date();
    var end = new Date(now);
    end.setHours(23, 59, 59, 999);

    var diff = Math.max(0, end.getTime() - now.getTime());
    var hours = Math.floor(diff / 3600000);
    var minutes = Math.floor((diff % 3600000) / 60000);
    var seconds = Math.floor((diff % 60000) / 1000);

    countdowns.forEach(function (countdown) {
      var hoursNode = countdown.querySelector("[data-hours]");
      var minutesNode = countdown.querySelector("[data-minutes]");
      var secondsNode = countdown.querySelector("[data-seconds]");

      if (hoursNode) hoursNode.textContent = pad(hours);
      if (minutesNode) minutesNode.textContent = pad(minutes);
      if (secondsNode) secondsNode.textContent = pad(seconds);
    });
  }

  function initGallery() {
    var galleries = document.querySelectorAll("[data-gallery]");

    galleries.forEach(function (gallery) {
      var image = gallery.querySelector("[data-gallery-image]");
      var thumbs = gallery.querySelectorAll("[data-gallery-src]");

      thumbs.forEach(function (thumb) {
        thumb.addEventListener("click", function () {
          var nextSource = thumb.getAttribute("data-gallery-src");
          var nextAlt = thumb.querySelector("img") ? thumb.querySelector("img").alt : "";

          if (image && nextSource) {
            image.src = nextSource;
            image.alt = nextAlt || image.alt;
          }

          thumbs.forEach(function (item) {
            item.classList.remove("is-active");
            item.setAttribute("aria-pressed", "false");
          });

          thumb.classList.add("is-active");
          thumb.setAttribute("aria-pressed", "true");
        });
      });
    });
  }

  function initAccordions() {
    var accordions = document.querySelectorAll("[data-accordion]");

    accordions.forEach(function (accordion) {
      var items = accordion.querySelectorAll("[data-accordion-item], .sb-accordion-item");

      items.forEach(function (item) {
        var button = item.querySelector("[data-accordion-trigger], .sb-accordion-trigger");
        var panel = item.querySelector("[data-accordion-panel], .sb-accordion-panel");

        if (!button || !panel) return;

        button.addEventListener("click", function () {
          var open = item.classList.contains("is-open");

          items.forEach(function (otherItem) {
            var otherButton = otherItem.querySelector("[data-accordion-trigger], .sb-accordion-trigger");
            otherItem.classList.remove("is-open");
            if (otherButton) otherButton.setAttribute("aria-expanded", "false");
          });

          if (!open) {
            item.classList.add("is-open");
            button.setAttribute("aria-expanded", "true");
          }
        });
      });
    });
  }

  function initCarousels() {
    var carousels = document.querySelectorAll("[data-carousel]");

    carousels.forEach(function (carousel) {
      var track = carousel.querySelector("[data-carousel-track]");
      var previous = carousel.querySelector("[data-carousel-prev]");
      var next = carousel.querySelector("[data-carousel-next]");

      if (!track) return;

      function scrollByCard(direction) {
        var card = track.querySelector(":scope > *");
        var distance = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.85;

        track.scrollBy({
          left: direction * distance,
          behavior: "smooth"
        });
      }

      if (previous) {
        previous.addEventListener("click", function () {
          scrollByCard(-1);
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          scrollByCard(1);
        });
      }
    });
  }

  function initOfferButtons() {
    var buttons = document.querySelectorAll("[data-scroll-target]");

    buttons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        var targetSelector = button.getAttribute("data-scroll-target");
        var target = targetSelector ? document.querySelector(targetSelector) : null;

        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });
  }

  function initStickyOffer() {
    var sticky = document.querySelector(".sb-sticky-offer");
    var product = document.querySelector(".sb-product");

    if (!sticky || !product) return;

    function updateSticky() {
      var trigger = product.offsetTop + Math.min(product.offsetHeight * 0.72, window.innerHeight * 1.25);
      sticky.classList.toggle("is-visible", window.scrollY > trigger);
    }

    updateSticky();
    window.addEventListener("scroll", updateSticky, { passive: true });
    window.addEventListener("resize", updateSticky);
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateCountdown();
    setInterval(updateCountdown, 1000);
    initGallery();
    initAccordions();
    initCarousels();
    initOfferButtons();
    initStickyOffer();
  });
})();
