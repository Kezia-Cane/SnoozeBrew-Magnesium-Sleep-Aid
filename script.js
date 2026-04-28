(function () {
  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateCountdown() {
    var now = new Date();
    var end = new Date(now);
    end.setHours(23, 59, 59, 999);

    var diff = Math.max(0, end.getTime() - now.getTime());
    var hours = Math.floor(diff / 3600000);
    var minutes = Math.floor((diff % 3600000) / 60000);
    var seconds = Math.floor((diff % 60000) / 1000);

    var values = {
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds)
    };

    Object.keys(values).forEach(function (key) {
      var node = document.querySelector('[data-countdown="' + key + '"]');
      if (!node) return;

      if (node.textContent !== values[key]) {
        var box = node.closest(".sb-timebox");
        node.textContent = values[key];

        if (box) {
          box.classList.remove("is-ticking");
          void box.offsetWidth;
          box.classList.add("is-ticking");
        }
      }
    });
  }

  function initGallery() {
    var galleries = document.querySelectorAll("[data-gallery]");

    galleries.forEach(function (gallery) {
      var image = gallery.querySelector("[data-gallery-image]");
      var thumbs = gallery.querySelectorAll("[data-gallery-src]");

      // Gallery logic start
      thumbs.forEach(function (thumb) {
        thumb.addEventListener("click", function () {
          var nextSource = thumb.getAttribute("data-gallery-src");
          var nextAlt = thumb.getAttribute("data-gallery-alt") || "";

          if (image && nextSource) {
            if (image.getAttribute("src") !== nextSource) {
              var preloader = new Image();
              preloader.onload = function () {
                image.src = nextSource;
                image.alt = nextAlt || image.alt;
              };
              preloader.src = nextSource;
            } else {
              image.alt = nextAlt || image.alt;
            }
          }

          thumbs.forEach(function (item) {
            item.classList.remove("is-active");
            item.setAttribute("aria-pressed", "false");
          });

          thumb.classList.add("is-active");
          thumb.setAttribute("aria-pressed", "true");
          thumb.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest"
          });
        });
      });
      // Gallery logic end
    });
  }

  function initGallerySticky() {
    var topOffset = 24;
    var desktopQuery = window.matchMedia("(min-width: 990px)");
    var galleries = document.querySelectorAll("[data-gallery]");

    function resetGallery(gallery, sticky) {
      gallery.classList.remove("is-fixed", "is-bottom");
      gallery.style.removeProperty("--sb-gallery-left");
      gallery.style.removeProperty("--sb-gallery-width");
      gallery.style.removeProperty("min-height");
      sticky.style.removeProperty("width");
    }

    function updateGallery(gallery) {
      var sticky = gallery.querySelector(".sb-gallery-sticky");
      var container = gallery.closest(".sb-product-container");
      var galleryRect;
      var stickyRect;
      var galleryTop;
      var containerTop;
      var containerBottom;
      var stickyHeight;
      var stopPoint;

      if (!sticky || !container || !desktopQuery.matches) {
        if (sticky) resetGallery(gallery, sticky);
        return;
      }

      galleryRect = gallery.getBoundingClientRect();
      stickyRect = sticky.getBoundingClientRect();
      galleryTop = galleryRect.top + window.scrollY;
      containerTop = container.getBoundingClientRect().top + window.scrollY;
      containerBottom = containerTop + container.offsetHeight;
      stickyHeight = sticky.offsetHeight;
      stopPoint = containerBottom - stickyHeight - topOffset;

      gallery.style.setProperty("--sb-gallery-left", galleryRect.left + "px");
      gallery.style.setProperty("--sb-gallery-width", galleryRect.width + "px");
      gallery.style.minHeight = Math.max(stickyHeight, container.offsetHeight) + "px";

      if (window.scrollY <= galleryTop - topOffset) {
        gallery.classList.remove("is-fixed", "is-bottom");
      } else if (window.scrollY < stopPoint) {
        gallery.classList.add("is-fixed");
        gallery.classList.remove("is-bottom");
      } else {
        gallery.classList.remove("is-fixed");
        gallery.classList.add("is-bottom");
      }
    }

    function updateAll() {
      galleries.forEach(function (gallery) {
        updateGallery(gallery);
      });
    }

    // Gallery logic start
    window.addEventListener("scroll", updateAll, { passive: true });
    window.addEventListener("resize", updateAll);
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", updateAll);
    }
    updateAll();
    // Gallery logic end
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
      var dots = carousel.querySelectorAll("[data-carousel-dot]");
      var activeIndex = 0;

      if (!track) return;

      function cards() {
        return Array.prototype.slice.call(track.children);
      }

      function setActiveDot(index) {
        activeIndex = index;
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      function scrollToCard(index, behavior) {
        var card = cards()[index];
        var targetLeft;

        if (!card) return;

        targetLeft = card.offsetLeft - (track.clientWidth - card.getBoundingClientRect().width) / 2;

        track.scrollTo({
          left: Math.max(0, targetLeft),
          behavior: behavior || "smooth"
        });

        setActiveDot(index);
      }

      function syncActiveDotToScroll() {
        var trackCenter = track.scrollLeft + track.clientWidth / 2;
        var closestIndex = 0;
        var closestDistance = Infinity;

        cards().forEach(function (card, index) {
          var cardCenter = card.offsetLeft + card.getBoundingClientRect().width / 2;
          var distance = Math.abs(cardCenter - trackCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        setActiveDot(closestIndex);
      }

      function scrollByCard(direction) {
        var card = track.querySelector(":scope > *");
        var distance = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.85;

        track.scrollBy({
          left: direction * distance,
          behavior: "smooth"
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          var targetIndex = Number(dot.getAttribute("data-carousel-dot"));
          scrollToCard(targetIndex, "smooth");
        });
      });

      if (dots.length) {
        var defaultIndex = 0;

        if (carousel.classList.contains("sb-results-carousel") && window.matchMedia("(max-width: 989px)").matches) {
          defaultIndex = Math.min(2, cards().length - 1);
        }

        setActiveDot(defaultIndex);
        window.requestAnimationFrame(function () {
          scrollToCard(defaultIndex, "auto");
        });
      }

      track.addEventListener("scroll", syncActiveDotToScroll, { passive: true });

      window.addEventListener("resize", function () {
        if (dots.length) {
          scrollToCard(activeIndex, "auto");
        }
      });

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
    initGallerySticky();
    initAccordions();
    initCarousels();
    initOfferButtons();
    initStickyOffer();
  });
})();
