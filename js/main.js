/* =====================================================================
   RAYSSIA NAILS — Interações
   (os dados editáveis ficam em js/config.js)
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.RAYSSIA_CONFIG || {};
  var MSG = CFG.messages || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Utilidades ---------- */
  function escapeHTML(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Monta URL de imagem otimizada (Unsplash) ou devolve o caminho local */
  function imgUrl(src, w, h) {
    if (/images\.unsplash\.com/.test(src)) {
      var base = src.split("?")[0];
      return base + "?auto=format&fit=crop&w=" + w + (h ? "&h=" + h : "") + "&q=75";
    }
    return src;
  }
  function imgSrcset(src, widths) {
    if (!/images\.unsplash\.com/.test(src)) return "";
    return widths.map(function (w) { return imgUrl(src, w) + " " + w + "w"; }).join(", ");
  }

  /* ---------- WhatsApp ---------- */
  function waLink(key) {
    var text = MSG.default || "";
    if (key && key.indexOf("servico:") === 0) {
      var s = key.slice(8);
      text = (MSG.services && MSG.services[s]) || text;
    } else if (key && MSG[key]) {
      text = MSG[key];
    }
    var number = String(CFG.whatsappNumber || "").replace(/\D/g, "");
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(text);
  }

  function applyWhatsAppLinks(root) {
    $$("[data-wa]", root).forEach(function (el) {
      el.setAttribute("href", waLink(el.getAttribute("data-wa")));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  /* ---------- Dados do rodapé ---------- */
  function applyConfigText() {
    $$("[data-config]").forEach(function (el) {
      var v = CFG[el.getAttribute("data-config")];
      if (v) el.textContent = v;
    });
    $$("[data-config-href]").forEach(function (el) {
      var v = CFG[el.getAttribute("data-config-href")];
      if (v) el.setAttribute("href", v);
    });
    $$("[data-config-list]").forEach(function (el) {
      var list = CFG[el.getAttribute("data-config-list")];
      if (Array.isArray(list) && list.length) {
        el.innerHTML = list.map(function (t) { return "<li>" + escapeHTML(t) + "</li>"; }).join("");
      }
    });
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- Fallback de imagens quebradas ---------- */
  function guardImage(img) {
    var mark = function () {
      var holder = img.closest(".media") || img.parentElement;
      if (holder) holder.classList.add("is-broken", "media");
    };
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) mark();
    img.addEventListener("error", mark, { once: true });
  }

  /* ---------- Galeria ---------- */
  var galleryItems = Array.isArray(CFG.gallery) ? CFG.gallery : [];

  function renderGallery() {
    var grid = $("#gallery-grid");
    if (!grid) return;
    grid.innerHTML = galleryItems.map(function (item, i) {
      var size = item.size === "tall" ? " gallery__item--tall" : item.size === "wide" ? " gallery__item--wide" : "";
      var w = item.size === "wide" ? 900 : 600;
      return (
        '<li class="gallery__item' + size + ' reveal" style="--d:' + (i % 4) * 70 + 'ms">' +
          '<button class="gallery__btn media" type="button" data-index="' + i + '" aria-label="Ampliar foto: ' + escapeHTML(item.label || item.alt) + '">' +
            '<img src="' + escapeHTML(imgUrl(item.src, w)) + '"' +
              (imgSrcset(item.src, [400, w, w + 400]) ? ' srcset="' + escapeHTML(imgSrcset(item.src, [400, w, w + 400])) + '" sizes="(min-width: 900px) 25vw, 50vw"' : "") +
              ' alt="' + escapeHTML(item.alt) + '" loading="lazy" decoding="async" width="' + w + '" height="' + w + '">' +
            '<span class="gallery__label"><span>' + escapeHTML(item.label || "") + '</span><svg class="icon"><use href="#i-zoom"/></svg></span>' +
          "</button>" +
        "</li>"
      );
    }).join("");
  }

  /* ---------- Depoimentos ---------- */
  function renderTestimonials() {
    var track = $("#testimonials-track");
    if (!track) return;
    var list = Array.isArray(CFG.testimonials) ? CFG.testimonials : [];
    track.innerHTML = list.map(function (t, i) {
      var initial = (t.name || "?").trim().charAt(0).toUpperCase();
      return (
        '<figure class="testimonial reveal" style="--d:' + i * 90 + 'ms">' +
          (t.placeholder ? '<span class="testimonial__tag">Exemplo</span>' : "") +
          '<div class="testimonial__top"><span class="stars testimonial__stars" aria-label="Nota ' + (t.rating || 5) + ' de 5">' + "★★★★★".slice(0, t.rating || 5) + "</span>" +
          '<svg class="icon testimonial__quote" aria-hidden="true"><use href="#i-quote"/></svg></div>' +
          '<blockquote class="testimonial__text"><p>' + escapeHTML(t.text) + "</p></blockquote>" +
          '<figcaption class="testimonial__author">' +
            '<span class="testimonial__avatar" aria-hidden="true">' + escapeHTML(initial) + "</span>" +
            '<span><span class="testimonial__name">' + escapeHTML(t.name) + "</span><br>" +
            '<span class="testimonial__service">' + escapeHTML(t.service) + "</span></span>" +
          "</figcaption>" +
        "</figure>"
      );
    }).join("");
  }

  /* ---------- Header: sombra ao rolar + link ativo ---------- */
  function initHeader() {
    var header = $("#header");
    var links = $$(".nav__link");
    var sections = links
      .map(function (a) { return $(a.getAttribute("href")); })
      .filter(Boolean);
    var ticking = false;

    function update() {
      ticking = false;
      header.classList.toggle("is-scrolled", window.scrollY > 12);

      // seção ativa = última cujo topo já passou de ~35% da tela;
      // no fim da página, destaca "Contato"
      var line = window.innerHeight * 0.35;
      var current = sections[0];
      sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1];
      }
      links.forEach(function (a) {
        var on = current && a.getAttribute("href") === "#" + current.id;
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    }

    update();
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ---------- Menu mobile ---------- */
  function initMobileMenu() {
    var toggle = $(".menu-toggle");
    var menu = $("#mobile-menu");
    if (!toggle || !menu) return;
    var icon = $("use", toggle);

    function setOpen(open) {
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", String(!open));
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      icon.setAttribute("href", open ? "#i-x" : "#i-menu");
      document.body.classList.toggle("is-locked", open);
      if (open) { var first = $("a", menu); if (first) first.focus({ preventScroll: true }); }
    }

    toggle.addEventListener("click", function () { setOpen(!menu.classList.contains("is-open")); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (mq) { if (mq.matches) setOpen(false); });
  }

  /* ---------- Animações de entrada ---------- */
  function initReveal() {
    var els = $$(".reveal:not(.is-visible)");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Carrosséis (mobile): pontos indicadores ---------- */
  function initCarousels() {
    [["services", ".services__track"], ["testimonials", "#testimonials-track"]].forEach(function (pair) {
      var track = $(pair[1]);
      var dots = $('[data-dots-for="' + pair[0] + '"]');
      if (!track || !dots) return;
      var cards = Array.prototype.slice.call(track.children);
      dots.innerHTML = cards.map(function () { return "<span></span>"; }).join("");
      var dotEls = Array.prototype.slice.call(dots.children);

      function update() {
        var max = track.scrollWidth - track.clientWidth;
        var idx = 0;
        if (max > 4) {
          var ratio = track.scrollLeft / max;
          idx = Math.round(ratio * (cards.length - 1));
        }
        dotEls.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
      }
      update();
      track.addEventListener("scroll", function () { window.requestAnimationFrame(update); }, { passive: true });
      window.addEventListener("resize", update);
    });
  }

  /* ---------- FAQ (acordeão) ---------- */
  function initAccordion() {
    var triggers = $$(".accordion__trigger");
    triggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        triggers.forEach(function (other) {           // abre um por vez
          if (other !== btn && other.getAttribute("aria-expanded") === "true") {
            other.setAttribute("aria-expanded", "false");
            $("#" + other.getAttribute("aria-controls")).classList.remove("is-open");
          }
        });
        btn.setAttribute("aria-expanded", String(!open));
        $("#" + btn.getAttribute("aria-controls")).classList.toggle("is-open", !open);
      });
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var box = $("#lightbox");
    var grid = $("#gallery-grid");
    if (!box || !grid || !galleryItems.length) return;
    var img = $(".lightbox__img", box);
    var cap = $(".lightbox__caption", box);
    var current = 0, lastFocus = null, touchX = null;

    function show(i) {
      current = (i + galleryItems.length) % galleryItems.length;
      var item = galleryItems[current];
      img.style.opacity = "0";
      img.onload = function () { img.style.opacity = "1"; };
      img.onerror = function () { img.style.opacity = "1"; img.alt = "Não foi possível carregar a foto"; };
      img.src = imgUrl(item.src, 1400);
      img.alt = item.alt || "";
      cap.textContent = item.label || "";
    }
    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.hidden = false;
      document.body.classList.add("is-locked");
      requestAnimationFrame(function () { box.classList.add("is-open"); });
      $(".lightbox__close", box).focus();
    }
    function close() {
      box.classList.remove("is-open");
      document.body.classList.remove("is-locked");
      setTimeout(function () { box.hidden = true; }, reduceMotion ? 0 : 300);
      if (lastFocus) lastFocus.focus();
    }

    grid.addEventListener("click", function (e) {
      var btn = e.target.closest(".gallery__btn");
      if (btn) open(Number(btn.getAttribute("data-index")));
    });
    $(".lightbox__close", box).addEventListener("click", close);
    $(".lightbox__prev", box).addEventListener("click", function () { show(current - 1); });
    $(".lightbox__next", box).addEventListener("click", function () { show(current + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });

    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(current + 1);
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "Tab") {                      // mantém o foco dentro do lightbox
        var f = $$("button", box);
        var i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });

    box.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      touchX = null;
    });
  }

  /* ---------- Inicialização ---------- */
  renderGallery();
  renderTestimonials();
  applyWhatsAppLinks(document);
  applyConfigText();
  $$("img").forEach(guardImage);
  initHeader();
  initMobileMenu();
  initAccordion();
  initCarousels();
  initLightbox();
  initReveal();
})();
