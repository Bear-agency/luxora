(function () {
  var ASSET_VERSION = "20260507-hero-title-plain-text";
  var HERO_LINE_1 = "Global Financial Infrastructure";
  var HERO_LINE_2 = "for Modern Businesses";

  function withVersion(path) {
    return path + (path.indexOf("?") === -1 ? "?" : "&") + "v=" + encodeURIComponent(ASSET_VERSION);
  }

  function fetchPartial(path) {
    return fetch(withVersion(path), { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("Failed to load " + path);
      return res.text();
    });
  }

  function loadPartials() {
    var slots = Array.prototype.slice.call(document.querySelectorAll("[data-partial]"));
    var chain = Promise.resolve();

    slots.forEach(function (slot) {
      var path = slot.getAttribute("data-partial");
      chain = chain.then(function () {
        return fetchPartial(path).then(function (html) {
          slot.outerHTML = html;
        });
      });
    });

    return chain;
  }

  function loadMainScript() {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = withVersion("sections/shared/main.js");
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  function enforcePlainHeroTitle() {
    var heroTitle = document.getElementById("hero-title");
    if (!heroTitle) return;
    heroTitle.innerHTML = HERO_LINE_1 + "<br>" + HERO_LINE_2;
  }

  /** Scroll to #id after async partials replace DOM (fixes index#contact, terms#…, privacy#…). */
  function scrollToHashIfNeeded() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return false;
    var id = decodeURIComponent(hash.slice(1));
    if (!id) return false;
    try {
      var el = document.getElementById(id);
      if (!el) return false;
      el.scrollIntoView({ behavior: "auto", block: "start" });
      return true;
    } catch (e) {
      return false;
    }
  }

  function scrollToHashWithRetry() {
    if (scrollToHashIfNeeded()) return;
    var attempts = 0;
    var t = setInterval(function () {
      attempts += 1;
      if (scrollToHashIfNeeded() || attempts > 40) clearInterval(t);
    }, 50);
  }

  loadPartials()
    .then(function () {
      enforcePlainHeroTitle();
      scrollToHashWithRetry();
      return new Promise(function (resolve) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            enforcePlainHeroTitle();
            scrollToHashIfNeeded();
            resolve();
          });
        });
      });
    })
    .then(loadMainScript)
    .then(function () {
      enforcePlainHeroTitle();
      window.addEventListener("hashchange", function () {
        scrollToHashIfNeeded();
      });
    })
    .catch(function (err) {
      console.error("Section loading error:", err);
    });
})();
