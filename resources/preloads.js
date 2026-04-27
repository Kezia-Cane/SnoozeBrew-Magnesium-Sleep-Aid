
    (function() {
      var preconnectOrigins = ["https://cdn.shopify.com"];
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills.CgsWKOqO.js","/cdn/shopifycloud/checkout-web/assets/c1/app.oIULbOis.js","/cdn/shopifycloud/checkout-web/assets/c1/dist-vendor.DEg-Du23.js","/cdn/shopifycloud/checkout-web/assets/c1/browser.Blv1NClA.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-FullScreenBackground.Dtw-AkWI.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-unactionable-errors.CTtb6GFr.js","/cdn/shopifycloud/checkout-web/assets/c1/actions-shop-discount-offer.BBIdeLIn.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-alternativePaymentCurrency.yhuFKehg.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-shared.DbT-r34C.js","/cdn/shopifycloud/checkout-web/assets/c1/utils-BusinessCustomerShippingAddressManager.DAEBSL7b.js","/cdn/shopifycloud/checkout-web/assets/c1/helpers-shared.D6VsTIuy.js","/cdn/shopifycloud/checkout-web/assets/c1/shop-pay-usePostPurchase.BXmK5SS2.js","/cdn/shopifycloud/checkout-web/assets/c1/images-flag-icon.C_eXYJRt.js","/cdn/shopifycloud/checkout-web/assets/c1/images-payment-icon.D2Fpq5Mq.js","/cdn/shopifycloud/checkout-web/assets/c1/locale-en.De_zeoRq.js","/cdn/shopifycloud/checkout-web/assets/c1/page-OnePage.BDcexJfi.js","/cdn/shopifycloud/checkout-web/assets/c1/Captcha-MarketsProDisclaimer.Disz6lrk.js","/cdn/shopifycloud/checkout-web/assets/c1/Menu-CrossBorderConsolidation.DjlJQzpl.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShopPayButtonClassName.DmBnG8WY.js","/cdn/shopifycloud/checkout-web/assets/c1/icons-ShopPayLogo.BvyjSgdt.js","/cdn/shopifycloud/checkout-web/assets/c1/BuyWithPrimeChangeLink-VaultedPayment.CymH9F8V.js","/cdn/shopifycloud/checkout-web/assets/c1/DeliveryMacros-ShippingGroupsSummaryLine.BTk4-2mw.js","/cdn/shopifycloud/checkout-web/assets/c1/MerchandisePreviewThumbnail-StackedMerchandisePreview.l3uyMKu5.js","/cdn/shopifycloud/checkout-web/assets/c1/Map-PickupPointCarrierLogo.C32LnJLQ.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks.B1dRdph5.js","/cdn/shopifycloud/checkout-web/assets/c1/PostPurchaseShouldRender-LocalizationExtensionField.DR7jj8NC.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-useShowShopPayOptin.BqYNg8W3.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-ShopPayOptInDisclaimer.CfM86zCo.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-RememberMeDescriptionText.DkXT6raR.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-MobileOrderSummary.aNH3CYoI.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-OrderEditVaultedDelivery.DOapBUsU.js","/cdn/shopifycloud/checkout-web/assets/c1/captcha-SeparatePaymentsNotice.Be7pSkF-.js","/cdn/shopifycloud/checkout-web/assets/c1/types-useHasOrdersFromMultipleShops.DkGXa64Y.js","/cdn/shopifycloud/checkout-web/assets/c1/shopPaySessionTokenStorage-Page.DVVXRtw1.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-PaymentButtons.DIT6FcWw.js","/cdn/shopifycloud/checkout-web/assets/c1/icons-OffsitePaymentFailed.kN7rcDV4.js","/cdn/shopifycloud/checkout-web/assets/c1/StockProblems-StockProblemsLineItemList.Dvahf6A_.js","/cdn/shopifycloud/checkout-web/assets/c1/redemption-useShopCashCheckoutEligibility.UeuMxx0p.js","/cdn/shopifycloud/checkout-web/assets/c1/negotiated-ShipmentBreakdown.Bx8VYj6o.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-MerchandiseModal.BNl5fFgI.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-shipping-options.KHgQ6VhY.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-DutyOptions.DdNGmKhE.js","/cdn/shopifycloud/checkout-web/assets/c1/DeliveryInstructionsFooter-ShippingMethodSelector.D2irhrZ5.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-SubscriptionPriceBreakdown.CLbWvabD.js"];
      var styles = ["/cdn/shopifycloud/checkout-web/assets/c1/assets/app.Ct4r0T82.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/FullScreenBackground.CfHxiIwO.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/usePostPurchase.aXXv0q5D.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/OnePage.CqEBJWPh.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/CrossBorderConsolidation.LuHtqm8n.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/LocalizationExtensionField.oEoBAbtG.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/MobileOrderSummary.Cko1fUoG.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/OrderEditVaultedDelivery.CSQKPDv7.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useShopPayButtonClassName.BrcQzLuH.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/DutyOptions.LcqrKXE1.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/VaultedPayment.OxMVm7u-.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PickupPointCarrierLogo.cbVP6Hp_.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Page.BYM12A8B.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/OffsitePaymentFailed.BxwwfmsJ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/StackedMerchandisePreview.D6OuIVjc.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShippingMethodSelector.B0hio2RO.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/SubscriptionPriceBreakdown.BSemv9tH.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0762/7997/2072/files/Screenshot_2025-12-04_at_5.09.10_pm_x320.png?v=1764928761"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = preconnectOrigins.concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  