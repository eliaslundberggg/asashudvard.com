// Åsas Hudvård – små interaktioner. Allt innehåll finns redan i HTML:en (bra för Google).
(function () {
  // Mobilmeny
  var mb = document.querySelector(".menu-btn"), mm = document.querySelector(".mobile-menu");
  if (mb && mm) mb.addEventListener("click", function () {
    var open = mm.classList.toggle("open");
    mb.setAttribute("aria-expanded", open);
  });

  // Bildspel "Om mig"
  document.querySelectorAll("[data-slider]").forEach(function (root) {
    var slides = root.querySelectorAll(".slide"), i = 0;
    function show(n) { i = (n + slides.length) % slides.length; slides.forEach(function (s, k) { s.hidden = k !== i; }); }
    root.querySelectorAll("[data-dir]").forEach(function (b) {
      b.addEventListener("click", function () { show(i + Number(b.dataset.dir)); });
    });
  });

  // Video
  document.querySelectorAll(".video").forEach(function (v) {
    var btn = v.querySelector(".video-play"), vid = v.querySelector("video");
    if (!btn || !vid) return;
    btn.addEventListener("click", function () {
      v.classList.add("playing"); vid.controls = true; vid.muted = false;
      var p = vid.play(); if (p && p.catch) p.catch(function () { vid.muted = true; vid.play(); });
    });
  });

  // Omdömen: filter + pilar
  document.querySelectorAll("[data-reviews]").forEach(function (root) {
    var track = root.querySelector(".track"), cards = track.querySelectorAll(".rcard");
    var prev = root.querySelector("[data-prev]"), next = root.querySelector("[data-next]"), count = root.querySelector("[data-count]");
    function edges() {
      if (!prev) return;
      prev.disabled = track.scrollLeft < 8;
      next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
    }
    root.querySelectorAll(".chip[data-filter]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.dataset.filter, n = 0;
        root.querySelectorAll(".chip[data-filter]").forEach(function (c) { c.setAttribute("aria-pressed", c === chip); });
        cards.forEach(function (c) { var on = f === "alla" || c.dataset.cat.split(" ").indexOf(f) > -1; c.hidden = !on; if (on) n++; });
        if (count) count.textContent = n;
        track.scrollLeft = 0; edges();
      });
    });
    function step(d) { track.scrollBy({ left: d * Math.max(track.clientWidth * 0.85, 300), behavior: "smooth" }); }
    if (prev) { prev.addEventListener("click", function () { step(-1); }); next.addEventListener("click", function () { step(1); }); }
    track.addEventListener("scroll", edges, { passive: true });
    window.addEventListener("resize", edges); edges();
  });

  // Bokning: klinik + kategori
  document.querySelectorAll("[data-booking]").forEach(function (root) {
    var urls = { pitea: root.dataset.pitea, lulea: root.dataset.lulea };
    var names = { pitea: "Piteå", lulea: "Luleå" };
    var addr = { pitea: "Kolmilavägen 17, 941 37 Piteå", lulea: "Nygatan 5, Luleå" };
    root.querySelectorAll(".seg button").forEach(function (b) {
      b.addEventListener("click", function () {
        var c = b.dataset.city;
        root.querySelectorAll(".seg button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        root.querySelectorAll("[data-book]").forEach(function (a) { a.href = urls[c]; });
        root.querySelectorAll("[data-cityname]").forEach(function (s) { s.textContent = names[c]; });
        root.querySelectorAll("[data-cityaddr]").forEach(function (s) { s.textContent = addr[c]; });
      });
    });
    root.querySelectorAll(".cat-chips .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        root.querySelectorAll(".cat-chips .chip").forEach(function (c) { c.setAttribute("aria-pressed", c === chip); });
        root.querySelectorAll("[data-panel]").forEach(function (p) { p.hidden = p.dataset.panel !== chip.dataset.cat; });
      });
    });
  });
})();
