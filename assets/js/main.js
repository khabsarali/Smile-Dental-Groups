/* ============================================================
   main.js — boot, scroll plumbing, copy cross-fades.

   Scroll position is the only input. GSAP ScrollTrigger turns it
   into a 0..1 value with `scrub`, Lenis makes the wheel feel
   inertial, and a single rAF loop paints the frame.
   ============================================================ */
(function (global) {
  'use strict';

  var U = global.SDG.util;
  var CFG = global.SDG.config;

  var body = document.body;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var el = {
    canvas: document.getElementById('scene'),
    video: document.getElementById('videoTrack'),
    preloader: document.getElementById('preloader'),
    fill: document.getElementById('preloaderFill'),
    pct: document.getElementById('preloaderPct'),
    chapter: document.getElementById('chapterLabel'),
    cues: [].slice.call(document.querySelectorAll('.cue')),
    scrollcue: document.getElementById('scrollcue'),
    rail: document.getElementById('rail'),
    railFill: document.getElementById('railFill'),
    railTooth: document.getElementById('railTooth'),
    railTool: document.getElementById('railTool'),
    scroller: document.querySelector('.scroller'),
    track: document.getElementById('track')
  };

  /* Where each copy block lives on the timeline. Deliberately not
     the same as the chapter bounds — text should clear the frame
     before the next beat lands. */
  var CUES = {
    /* hero's fade-in window starts before 0 so it is already on
       screen at the top of the page rather than fading up */
    hero:      [-0.02, 0.001, 0.072, 0.104],
    entry:     [0.145, 0.176, 0.214, 0.246],
    xray:      [0.274, 0.306, 0.354, 0.386],
    treatment: [0.424, 0.458, 0.694, 0.736],
    reveal:    [0.764, 0.792, 0.844, 0.874],
    outro:     [0.912, 0.956, 1.200, 1.400]
  };

  var renderer = null;
  var track = null;
  var driver = { p: 0 };
  var last = { p: -1, chapter: '', tool: -1, tooth: -1 };

  /* ────────────────────────────────────────────────────────────
     Preloader
     ──────────────────────────────────────────────────────────── */
  var loaded = 0;
  function setProgress(v) {
    loaded = Math.max(loaded, U.clamp(v, 0, 1));
    var pc = Math.round(loaded * 100);
    if (el.fill) el.fill.style.width = pc + '%';
    if (el.pct) el.pct.textContent = pc;
  }

  function boot() {
    var steps = [];

    steps.push(
      document.fonts && document.fonts.ready
        ? document.fonts.ready.catch(function () {})
        : Promise.resolve()
    );

    var poll = 0;
    if (CFG.videoTrack && el.video) {
      body.dataset.track = 'video';
      track = new global.SDG.VideoTrack(el.video);
      steps.push(track.load().catch(function (err) {
        /* A missing or unplayable track must never take the page
           down — fall back to the canvas renderer. */
        console.warn(err.message);
        delete body.dataset.track;
        track = null;
      }));
      poll = setInterval(function () {
        if (track) setProgress(0.15 + track.progress() * 0.42);
      }, 120);
    }

    setProgress(0.12);

    Promise.all(steps).then(function () {
      if (poll) clearInterval(poll);
      setProgress(0.6);
      renderer = new global.SDG.Renderer(el.canvas);
      /* Warm the JIT, the gradient cache and — the expensive one —
         every cached soft-focus face plate, so the first scroll into
         the hero or the outro doesn't stall building one. The face
         changes warmth and smile across 0→0.14 and 0.88→1, so those
         two ranges are sampled densely and the middle is not. */
      var warm = [0, 0.03, 0.06, 0.09, 0.12, 0.2, 0.32, 0.55, 0.8,
                  0.9, 0.93, 0.95, 0.97, 0.99, 1];
      warm.forEach(function (p, i) {
        renderer.frame(p, i * 16);
        setProgress(0.6 + ((i + 1) / warm.length) * 0.38);
      });
      renderer.frame(0, 0);
      setProgress(1);
      requestAnimationFrame(function () {
        setTimeout(start, 260);
      });
    });
  }

  /* ────────────────────────────────────────────────────────────
     Reduced motion / static poster
     ──────────────────────────────────────────────────────────── */
  function startStatic() {
    body.classList.add('is-poster');
    body.classList.remove('is-loading');
    renderer = renderer || new global.SDG.Renderer(el.canvas);
    var paint = function () {
      renderer.resize();
      renderer.frame(0.962, 0);   // the resolved smile, held still
    };
    paint();
    window.addEventListener('resize', paint);
    document.getElementById('doc').style.marginTop = '92vh';
  }

  /* ────────────────────────────────────────────────────────────
     Run
     ──────────────────────────────────────────────────────────── */
  function start() {
    body.classList.remove('is-loading');

    if (reduced) { startStatic(); return; }

    if (el.track) el.track.style.height = CFG.scrollVh + 'vh';

    var lenis = null;
    var hasGsap = !!(global.gsap && global.ScrollTrigger);

    if (global.Lenis) {
      lenis = new global.Lenis({
        duration: 1.1,
        lerp: 0.09,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4
      });
    }

    if (hasGsap) {
      global.gsap.registerPlugin(global.ScrollTrigger);

      if (lenis) {
        lenis.on('scroll', global.ScrollTrigger.update);
        global.gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
        global.gsap.ticker.lagSmoothing(0);
      }

      global.gsap.to(driver, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el.scroller,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    } else {
      /* No GSAP: drive it off native scroll with our own easing so
         the page still works if the vendor bundle is blocked. */
      var raw = 0;
      var read = function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        raw = max > 0 ? U.clamp(window.scrollY / max, 0, 1) : 0;
      };
      read();
      driver.p = raw;
      window.addEventListener('scroll', read, { passive: true });
      window.addEventListener('resize', read);
      driver.__ease = function () { driver.p += (raw - driver.p) * 0.11; };
    }

    /* pointer parallax */
    if (!CFG.isTouch) {
      window.addEventListener('pointermove', function (e) {
        renderer.pointer(
          (e.clientX / window.innerWidth - 0.5) * 2,
          (e.clientY / window.innerHeight - 0.5) * 2
        );
      }, { passive: true });
    }

    var resize = debounce(function () {
      renderer.resize();
      if (el.track) el.track.style.height = CFG.scrollVh + 'vh';
      if (hasGsap) global.ScrollTrigger.refresh();
    }, 180);
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);

    requestAnimationFrame(loop);
  }

  function loop(time) {
    requestAnimationFrame(loop);
    if (driver.__ease) driver.__ease();

    var p = U.clamp(driver.p, 0, 1);

    if (track && track.ready) track.scrub(p);
    else renderer.frame(p, time);

    if (Math.abs(p - last.p) > 0.00015) {
      last.p = p;
      updateCopy(p);
      updateChrome(p);
    }
  }

  /* ────────────────────────────────────────────────────────────
     Copy layers
     ──────────────────────────────────────────────────────────── */
  function updateCopy(p) {
    for (var i = 0; i < el.cues.length; i++) {
      var node = el.cues[i];
      var win = CUES[node.dataset.cue];
      if (!win) continue;

      var inA = U.easeInOut(U.norm(p, win[0], win[1]));
      var outA = U.easeInOut(U.norm(p, win[2], win[3]));
      var a = inA * (1 - outA);

      if (a < 0.002) {
        if (node.style.opacity !== '0') {
          node.style.opacity = '0';
          node.style.visibility = 'hidden';
        }
        continue;
      }
      /* rises on entry, lifts away on exit — 26px, no more */
      var y = (1 - inA) * 26 - outA * 26;
      node.style.visibility = 'visible';
      node.style.opacity = a.toFixed(3);
      node.style.transform = 'translate3d(0,' + y.toFixed(2) + 'px,0)';
    }
  }

  /* ────────────────────────────────────────────────────────────
     Chrome: chapter label, scroll cue, treatment rail
     ──────────────────────────────────────────────────────────── */
  function updateChrome(p) {
    var ch = global.SDG.chapterAt(p);
    if (ch.label !== last.chapter) {
      last.chapter = ch.label;
      el.chapter.textContent = ch.label;
    }

    el.scrollcue.style.opacity = (1 - U.norm(p, 0.006, 0.05)).toFixed(3);

    var inTreatment = p > 0.395 && p < 0.756;
    if (inTreatment) {
      if (el.rail.hidden) el.rail.hidden = false;
      el.rail.classList.add('is-on');
      var tp = U.norm(p, 0.40, 0.75);
      el.railFill.style.width = (tp * 100).toFixed(1) + '%';

      var st = renderer ? renderer.state : null;
      if (!st) return;
      if (st.tooth !== last.tooth) {
        last.tooth = st.tooth;
        el.railTooth.textContent = '#' + String(st.tooth).padStart(2, '0');
      }
      if (st.tool !== last.tool) {
        last.tool = st.tool;
        el.railTool.textContent = global.SDG.instruments.TOOLS[st.tool].name;
      }
    } else if (!el.rail.hidden) {
      el.rail.classList.remove('is-on');
      el.rail.hidden = true;
    }
  }

  function debounce(fn, ms) {
    var id;
    return function () {
      clearTimeout(id);
      id = setTimeout(fn, ms);
    };
  }

  /* Vendor bundles are deferred; this file is last, so they're in. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);
