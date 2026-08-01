/* [NOME-PROVISORIO] — LP calça jeans masculina
   JS vanilla, sem dependência. Componentes: reveal · sticky CTA · carrossel
   infinito · lightbox · modal de upsell · telemetria de clique. */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. SCROLL REVEAL
     O hero NÃO usa .reveal — opacity:0 esperando JS atrasa o LCP.
     ───────────────────────────────────────────────────────────── */
  var rev = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    rev.forEach(function (el) { io.observe(el); });
  } else {
    rev.forEach(function (el) { el.classList.add('in'); });
  }

  /* ─────────────────────────────────────────────────────────────
     2. CTA FIXO
     Aparece quando o hero sai; some sobre as ofertas e o rodapé.
     tabIndex sincronizado com aria-hidden (senão quebra a11y).
     ───────────────────────────────────────────────────────────── */
  var sticky = document.getElementById('stickyCta');
  if (sticky && 'IntersectionObserver' in window) {
    var link = sticky.querySelector('a');
    var heroOut = false, atEnd = false;

    function paint() {
      var show = heroOut && !atEnd;
      sticky.classList.toggle('show', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (link) link.tabIndex = show ? 0 : -1;
    }

    var hero = document.querySelector('.hero');
    if (hero) {
      new IntersectionObserver(function (es) {
        heroOut = !es[0].isIntersecting; paint();
      }, { threshold: 0 }).observe(hero);
    }

    var endZones = [document.getElementById('ofertas'), document.querySelector('footer')]
      .filter(Boolean);
    if (endZones.length) {
      var visible = new Set();
      var endIO = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
        });
        atEnd = visible.size > 0; paint();
      }, { threshold: 0 });
      endZones.forEach(function (z) { endIO.observe(z); });
    }
  }

  /* ─────────────────────────────────────────────────────────────
     3. CARROSSEL INFINITO — [data-caro]
     Esteira contínua + setas + arrasto + pausa ao interagir +
     reduced-motion + clones sem foco (a11y).
     ───────────────────────────────────────────────────────────── */
  function initCarousel(caro) {
    var track = caro.querySelector('.caro-track');
    if (!track) return;

    var dir = parseFloat(caro.getAttribute('data-dir')) || 1;
    var origCount = track.children.length;
    if (!origCount) return;

    // clona uma vez para o loop; remove focáveis do clone
    [].slice.call(track.children).forEach(function (node) {
      var c = node.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      [].slice.call(c.querySelectorAll('a,button,[tabindex]')).forEach(function (el) {
        el.setAttribute('tabindex', '-1');
      });
      track.appendChild(c);
    });

    var half = 0, x = 0, paused = false, dragging = false;
    var last = 0, moved = 0, startX = 0, startPos = 0, resumeT = null;
    var SPEED = 38; // px/s
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    // período = offset do 1º clone (evita desvio acumulado do gap)
    function measure() {
      var first = track.children[origCount];
      half = first ? first.offsetLeft : track.scrollWidth / 2;
    }
    function wrap() { if (half > 0) x = ((x % half) + half) % half; }
    function render() { track.style.transform = 'translateX(' + (-x) + 'px)'; }

    measure(); render();

    function remeasure() {
      var ratio = half ? x / half : 0;
      measure(); x = ratio * half; render();
    }
    addEventListener('load', remeasure);
    addEventListener('resize', remeasure);

    function tick(t) {
      if (!last) last = t;
      var dt = Math.min((t - last) / 1000, .05);
      last = t;
      if (!paused && !dragging && !reduce) { x += dir * SPEED * dt; wrap(); render(); }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    function hold() {
      if (resumeT) clearTimeout(resumeT);
      paused = true;
      resumeT = setTimeout(function () { paused = false; last = 0; }, 3000);
    }
    function step() {
      var item = track.querySelector('.aslide');
      return item ? item.getBoundingClientRect().width + 16 : 240;
    }
    function by(d) {
      var start = x, t0 = null;
      (function anim(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 350, 1), e = 1 - Math.pow(1 - p, 3);
        x = start + d * e; wrap(); render();
        if (p < 1) requestAnimationFrame(anim);
      })(performance.now ? performance.now() : 0);
    }

    var prev = caro.querySelector('.caro-nav.prev');
    var next = caro.querySelector('.caro-nav.next');
    if (prev) prev.addEventListener('click', function () { by(-step()); hold(); });
    if (next) next.addEventListener('click', function () { by(step()); hold(); });

    caro.addEventListener('mouseenter', function () {
      paused = true; if (resumeT) clearTimeout(resumeT);
    });
    caro.addEventListener('mouseleave', function () {
      if (!dragging) { paused = false; last = 0; }
    });

    track.addEventListener('pointerdown', function (e) {
      dragging = true; moved = 0; startX = e.clientX; startPos = x;
      track.classList.add('grabbing');
      try { track.setPointerCapture(e.pointerId); } catch (_) {}
    });
    track.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var d = e.clientX - startX;
      moved = Math.max(moved, Math.abs(d));
      x = startPos - d; wrap(); render();
    });
    function end() {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('grabbing');
      caro.__moved = moved;   // o lightbox lê isto p/ não abrir depois de arrastar
      hold();
    }
    track.addEventListener('pointerup', end);
    track.addEventListener('pointercancel', end);
  }
  [].slice.call(document.querySelectorAll('[data-caro]')).forEach(initCarousel);

  /* ─────────────────────────────────────────────────────────────
     4. LIGHTBOX
     Carrega a versão -hd.webp (grande); o carrossel usa a pequena.
     ───────────────────────────────────────────────────────────── */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  if (lb && lbImg) {
    var shots = [], idx = 0, lastFocus = null;

    function hd(src) { return src.replace(/\.webp$/, '-hd.webp'); }

    function show(i) {
      if (!shots.length) return;
      idx = (i % shots.length + shots.length) % shots.length;
      var img = shots[idx];
      lbImg.src = hd(img.getAttribute('src'));
      lbImg.alt = img.getAttribute('alt') || '';
    }
    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      var c = lb.querySelector('[data-lb-close]');
      if (c) c.focus();
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      lbImg.src = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    [].slice.call(document.querySelectorAll('[data-lightbox]')).forEach(function (caro) {
      // só os slides originais, não os clones
      var originals = [].slice.call(caro.querySelectorAll('.aslide:not([aria-hidden]) img'));
      caro.addEventListener('click', function (e) {
        if (caro.__moved > 6) { caro.__moved = 0; return; } // foi arrasto, não clique
        var btn = e.target.closest('.aslide-btn');
        if (!btn) return;
        var img = btn.querySelector('img');
        if (!img) return;
        shots = originals.length ? originals
          : [].slice.call(caro.querySelectorAll('.aslide-btn img'));
        var i = shots.indexOf(img);
        open(i < 0 ? 0 : i);
      });
    });

    var p = lb.querySelector('[data-lb-prev]');
    var n = lb.querySelector('[data-lb-next]');
    var c = lb.querySelector('[data-lb-close]');
    if (p) p.addEventListener('click', function () { show(idx - 1); });
    if (n) n.addEventListener('click', function () { show(idx + 1); });
    if (c) c.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     5. MODAL DE UPSELL — dispara no clique do plano de 1 unidade
     ───────────────────────────────────────────────────────────── */
  var upsell = document.getElementById('upsell');
  if (upsell) {
    var upsellFocus = null;

    function openUpsell() {
      upsellFocus = document.activeElement;
      upsell.classList.add('open');
      document.body.style.overflow = 'hidden';
      var f = upsell.querySelector('.btn');
      if (f) f.focus();
    }
    function closeUpsell() {
      upsell.classList.remove('open');
      document.body.style.overflow = '';
      if (upsellFocus && upsellFocus.focus) upsellFocus.focus();
    }

    var basico = document.querySelector('[data-checkout="basico"]');
    if (basico) {
      basico.addEventListener('click', function (e) {
        // só intercepta a primeira vez; depois deixa seguir pro checkout
        if (basico.dataset.seen) return;
        e.preventDefault();
        basico.dataset.seen = '1';
        openUpsell();
      });
    }

    upsell.addEventListener('click', function (e) {
      if (e.target === upsell || e.target.closest('[data-close-btn]')) closeUpsell();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && upsell.classList.contains('open')) closeUpsell();
    });
  }

  /* ─────────────────────────────────────────────────────────────
     6. TELEMETRIA DE CLIQUE
     ───────────────────────────────────────────────────────────── */
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-cta]');
    if (!el) return;
    window.dataLayer.push({
      event: 'cta_click',
      cta: el.getAttribute('data-cta'),
      checkout: el.getAttribute('data-checkout') || null
    });
  });

  /* ─────────────────────────────────────────────────────────────
     7. ÂNCORAS SEM MEXER NO HISTÓRICO
     Pré-requisito do backredirect: link de hash cria entrada de
     histórico e dispararia o popstate em quem só rolou a página.
     ───────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

})();
