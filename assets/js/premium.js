/* Portfolio interactions: nav, reveals, counters, pointer effects. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;

  /* ---------------------------------------------------- scroll progress */
  var progress = document.querySelector(".progress");
  var header = document.querySelector(".header");

  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.scrollY;
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    if (header) header.classList.toggle("is-stuck", y > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------ mobile burger */
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".nav");

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest(".nav__link")) {
        nav.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* --------------------------------------------------------- scroll spy */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sections = links
    .map(function (l) { return document.querySelector(l.getAttribute("href")); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle("is-active", l.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------------------ reveals */
  var revealables = document.querySelectorAll("[data-reveal]");

  if (!reduced && "IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealables.forEach(function (el, i) {
      var group = el.parentElement;
      var index = group ? Array.prototype.indexOf.call(group.children, el) : i;
      if (!el.style.getPropertyValue("--d")) {
        el.style.setProperty("--d", Math.min(index, 6) * 80 + "ms");
      }
      revealer.observe(el);
    });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ----------------------------------------------------------- counters */
  var counters = document.querySelectorAll("[data-count]");

  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduced) { el.textContent = target + suffix; return; }

    var start = performance.now();
    var dur = 1500;
    (function tick(now) {
      var t = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  if (counters.length && "IntersectionObserver" in window) {
    var countObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { countObs.observe(c); });
  } else {
    counters.forEach(runCounter);
  }

  /* ------------------------------------------------ pointer glow + card */
  if (fine && !reduced) {
    var spotlight = document.querySelector(".spotlight");
    document.body.classList.add("has-spotlight");

    var sx = 0, sy = 0, tx = 0, ty = 0;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX;
      ty = e.clientY;

      var card = e.target.closest(".card");
      if (card) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      }
    });

    (function loop() {
      sx += (tx - sx) * 0.12;
      sy += (ty - sy) * 0.12;
      if (spotlight) spotlight.style.transform = "translate3d(" + sx + "px," + sy + "px,0)";
      requestAnimationFrame(loop);
    })();
  }

  /* --------------------------------------------------------- copy email */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var value = btn.getAttribute("data-copy");
      var done = function () {
        var original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(function () { btn.innerHTML = original; }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(function () {});
      }
    });
  });

  /* ----------------------------------------------------------- the year */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
