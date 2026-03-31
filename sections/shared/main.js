    (function () {
      var HERO_LINE_1 = "Global Financial Infrastructure";
      var HERO_LINE_2 = "for Modern Businesses";
      var HERO_WORD_DELAY_S = 0.08;
      var NAV_SCROLLED_Y = 24;
      var PARTICLE_COUNT = 8;

      function renderHeroHeadline() {
        var heroTitle = document.getElementById("hero-title");
        if (!heroTitle) return;
        var words = (HERO_LINE_1 + " " + HERO_LINE_2).split(" ");
        heroTitle.textContent = "";
        words.forEach(function (w, i) {
          var span = document.createElement("span");
          span.className = "word";
          span.textContent = w;
          span.style.animationDelay = HERO_WORD_DELAY_S * i + "s";
          heroTitle.appendChild(span);
          if (i === HERO_LINE_1.split(" ").length - 1) {
            heroTitle.appendChild(document.createElement("br"));
          }
        });
      }

      function initNavbar() {
        var nav = document.getElementById("nav");
        if (!nav) return;
        function onScrollNav() {
          nav.classList.toggle("is-scrolled", window.scrollY > NAV_SCROLLED_Y);
        }
        window.addEventListener("scroll", onScrollNav, { passive: true });
        onScrollNav();

        var toggle = document.getElementById("nav-toggle");
        var menu = document.getElementById("nav-menu");
        if (!toggle || !menu) return;

        toggle.addEventListener("click", function () {
          var open = menu.classList.toggle("is-open");
          toggle.setAttribute("aria-expanded", open);
        });
        menu.querySelectorAll("a").forEach(function (a) {
          a.addEventListener("click", function () {
            menu.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
          });
        });
      }

      function initScrollButtons() {
        document.querySelectorAll("[data-scroll]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var id = btn.getAttribute("data-scroll");
            var el = document.querySelector(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          });
        });
      }

      function initParticles() {
        var particles = document.getElementById("particles");
        if (!particles) return;
        for (var p = 0; p < PARTICLE_COUNT; p++) {
          var line = document.createElement("div");
          line.className = "particle-line";
          line.style.top = 12 + p * 11 + "%";
          line.style.width = 30 + Math.random() * 40 + "%";
          line.style.left = "-50%";
          line.style.animationDelay = p * 2.2 + "s";
          line.style.animationDuration = 14 + Math.random() * 10 + "s";
          particles.appendChild(line);
        }
      }

      function initRevealOnScroll() {
        var revealEls = document.querySelectorAll("[data-reveal]");
        var revealObs = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) {
                e.target.classList.add("is-visible");
              }
            });
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
        );
        revealEls.forEach(function (el) {
          revealObs.observe(el);
        });
      }

      function animateCount(el, target) {
        var dur = 1600;
        var t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = Math.floor(eased * target);
          el.textContent = String(val);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }

      function initStats() {
        var statObs = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              entry.target.querySelectorAll(".trust-count").forEach(function (el) {
                if (el.dataset.done) return;
                el.dataset.done = "1";
                if (el.dataset.count) animateCount(el, parseInt(el.dataset.count, 10));
              });
              entry.target.querySelectorAll(".trust-num-line").forEach(function (n) {
                if (n.dataset.done) return;
                n.dataset.done = "1";
                if (n.dataset.text) n.textContent = n.dataset.text;
              });
              statObs.unobserve(entry.target);
            });
          },
          { threshold: 0.35 }
        );
        var stats = document.getElementById("stats");
        if (stats) statObs.observe(stats);
      }

      function initFooterYear() {
        var year = document.getElementById("year");
        if (year) year.textContent = new Date().getFullYear();
      }

      function initConsultForm() {
        var form = document.getElementById("consult-form");
        if (!form) return;
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          alert("Thank you. A Luxora representative will contact you shortly.");
        });
      }

      renderHeroHeadline();
      initNavbar();
      initScrollButtons();
      initParticles();
      initRevealOnScroll();
      initStats();
      initFooterYear();
      initConsultForm();
    })();
