/* =====================================================================
   RAYSSIA NAILS — EFEITOS (GSAP + Motion)
   Opcional: se as bibliotecas não carregarem, o site funciona normalmente.
   Para desligar tudo, remova as tags <script> de efeitos no index.html.
   ===================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function ready() { root.classList.remove("fx-pending"); }

  if (reduce) { ready(); return; }

  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  var M = window.Motion;

  /* ---------------- GSAP: entrada do hero + parallax ---------------- */
  if (gsap) {
    if (ST) gsap.registerPlugin(ST);

    var lines = gsap.utils.toArray("[data-hero-line]");
    var fades = gsap.utils.toArray("[data-hero-fade]");
    gsap.set(lines, { y: 0, yPercent: 115 }); // y: 0 zera o deslocamento do CSS de pré-carregamento
    gsap.set(fades, { autoAlpha: 0, y: 26 });
    ready();

    // Animação baseada no relógio real (não "congela" se o navegador pular quadros)
    gsap.ticker.lagSmoothing(0);
    var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    // Garantia: o texto do topo sempre aparece, mesmo se o navegador estiver lento
    setTimeout(function () { if (intro.progress() < 1) intro.progress(1); }, 3500);
    intro
      .fromTo(".hero__media img", { scale: 1.22 }, { scale: 1, duration: 2.4, ease: "power2.out" }, 0)
      .from(".hero__media", { autoAlpha: 0, duration: 1.2, ease: "power1.out" }, 0)
      .to(fades.slice(0, 1), { autoAlpha: 1, y: 0, duration: 0.8 }, 0.3)
      .to(lines, { yPercent: 0, duration: 1.15, stagger: 0.14, ease: "power4.out" }, 0.4)
      .to(fades.slice(1), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.85);

    if (ST) {
      var heroScrub = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
      // Parallax leve (sem desbotar o texto — ele fica sempre 100% visível)
      gsap.fromTo(".hero__media", { yPercent: 0 }, { yPercent: 12, ease: "none", immediateRender: false, scrollTrigger: heroScrub });
      gsap.fromTo(".hero__inner", { y: 0 }, { y: -40, ease: "none", immediateRender: false, scrollTrigger: Object.assign({}, heroScrub) });

      // Fotos de "Sobre" e "Diferenciais" deslizam dentro da moldura
      gsap.utils.toArray(".about__photo img, .features__photo img").forEach(function (img) {
        gsap.fromTo(img,
          { yPercent: -7, scale: 1.16 },
          { yPercent: 7, scale: 1.16, ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // Anéis decorativos do CTA
      gsap.to(".cta__ring--1", { yPercent: 35, rotate: 20, ease: "none", scrollTrigger: { trigger: ".cta", scrub: true } });
      gsap.to(".cta__ring--2", { yPercent: -40, ease: "none", scrollTrigger: { trigger: ".cta", scrub: true } });

      // Contador da nota do Google
      var score = document.querySelector(".rating-summary__score");
      if (score) {
        var target = parseFloat((score.textContent || "5").replace(",", ".")) || 5;
        var counter = { v: 0 };
        gsap.to(counter, {
          v: target, duration: 1.6, ease: "power2.out",
          scrollTrigger: { trigger: score, start: "top 90%", once: true },
          onUpdate: function () { score.textContent = counter.v.toFixed(1).replace(".", ","); }
        });
      }
    }
  } else {
    ready();
  }

  /* ---------------- Motion: micro-interações com mola ---------------- */
  if (M && M.animate) {
    var springIn = { type: "spring", stiffness: 260, damping: 18 };
    var springOut = { type: "spring", stiffness: 180, damping: 10 };

    // Botões "magnéticos" (seguem levemente o cursor)
    document.querySelectorAll("[data-magnetic], .wa-float, .header__cta").forEach(function (el) {
      el.style.transitionProperty = "background-color, color, border-color, box-shadow";
      el.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var r = el.getBoundingClientRect();
        M.animate(el, {
          x: (e.clientX - r.left - r.width / 2) * 0.22,
          y: (e.clientY - r.top - r.height / 2) * 0.32
        }, springIn);
      });
      el.addEventListener("pointerleave", function () { M.animate(el, { x: 0, y: 0 }, springOut); });
    });

    // Estrelas das avaliações aparecem da esquerda para a direita
    if (M.inView) {
      // (as estrelas só são escondidas no instante em que a animação começa,
      //  então nunca ficam invisíveis se algo falhar)
      M.inView(".testimonial__stars, .rating-summary__stars", function (a) {
        var el = a && a.nodeType ? a : a && a.target;
        if (!el) return;
        M.animate(el, { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] }, { duration: 0.9, delay: 0.25, ease: [0.22, 0.61, 0.36, 1] });
      }, { amount: 0.6 });
    }

    // Barra de progresso de leitura no topo
    if (M.scroll) {
      M.scroll(M.animate(".scroll-progress", { transform: ["scaleX(0)", "scaleX(1)"] }, { ease: "linear" }));
    }

    root.classList.add("fx-motion");
  }
})();
