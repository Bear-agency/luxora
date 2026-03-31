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

  loadPartials()
    .then(loadMainScript)
    .catch(function (err) {
      console.error("Section loading error:", err);
    });
})();
