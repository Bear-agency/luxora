(function () {
  function fetchPartial(path) {
    return fetch(path).then(function (res) {
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
      script.src = "sections/shared/main.js";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
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
      scrollToHashWithRetry();
      return new Promise(function (resolve) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            scrollToHashIfNeeded();
            resolve();
          });
        });
      });
    })
    .then(loadMainScript)
    .then(function () {
      window.addEventListener("hashchange", function () {
        scrollToHashIfNeeded();
      });
    })
    .catch(function (err) {
      console.error("Section loading error:", err);
    });
})();
