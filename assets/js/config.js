/* ============================================================
   config.js — single source of truth for the narrative timeline,
   the palette and the (optional) pre-rendered video track.
   ============================================================ */
(function (global) {
  'use strict';

  /* Chapter boundaries, expressed as normalised scroll progress 0..1.
     These are the numbers in the brief; change them here and the canvas,
     the copy cross-fades and the chapter label all follow. */
  var CHAPTERS = [
    { id: 'hero',      label: 'Hero',        from: 0.00, to: 0.12 },
    { id: 'entry',     label: 'Intake',      from: 0.12, to: 0.25 },
    { id: 'xray',      label: 'Diagnostics', from: 0.25, to: 0.40 },
    { id: 'treatment', label: 'Treatment',   from: 0.40, to: 0.75 },
    { id: 'reveal',    label: 'Reveal',      from: 0.75, to: 0.88 },
    { id: 'outro',     label: 'Smile',       from: 0.88, to: 1.00 }
  ];

  var PALETTE = {
    navy: '#08131f',
    navyDeep: '#050c14',
    white: '#f6fafc',
    accent: '#3ad6c8',
    accentDeep: '#159e93',
    amber: '#ffb54a',
    gum: '#c2707a',
    gumSick: '#b8434f',
    enamel: '#f3f6f4',
    enamelSick: '#cdb387'
  };

  /* ── Optional pre-rendered track ─────────────────────────────
     The canvas renderer below is the default and needs no assets.
     If you render the six Seedance shots, stitch them into one
     continuous clip and point `videoTrack` at it — the page will
     scrub that clip's playhead against scroll instead of drawing.

       videoTrack: { desktop: 'assets/video/arch-1920.mp4',
                     mobile:  'assets/video/arch-720.mp4',
                     duration: 26 }

     Leave it null to stay on the canvas renderer.
     See README.md → "Swapping in a pre-rendered track". */
  var VIDEO_TRACK = null;

  var IS_TOUCH = matchMedia('(hover: none)').matches;
  var IS_SMALL = matchMedia('(max-width: 780px)').matches;

  global.SDG = global.SDG || {};
  global.SDG.config = {
    chapters: CHAPTERS,
    palette: PALETTE,
    videoTrack: VIDEO_TRACK,
    /* Scroll distance in viewport heights. Mirrors .scroller__track in CSS. */
    scrollVh: IS_SMALL ? 700 : 900,
    /* Cap device pixel ratio — the difference above 2 is invisible and costly. */
    maxDpr: IS_SMALL ? 1.75 : 2,
    /* Post effects: bloom and chromatic fringing are desktop-only. */
    effects: !IS_SMALL,
    isTouch: IS_TOUCH,
    isSmall: IS_SMALL,
    /* Virtual drawing space. Everything is authored against this and then
       cover-fitted to the viewport, so layout is resolution independent. */
    world: { w: 1600, h: 900 }
  };

  /* ── Small maths helpers shared by every module ───────────── */
  var U = {
    clamp: function (v, a, b) { return v < a ? a : v > b ? b : v; },
    lerp: function (a, b, t) { return a + (b - a) * t; },
    /* progress of `v` within [a,b], clamped */
    norm: function (v, a, b) {
      if (b === a) return 0;
      return U.clamp((v - a) / (b - a), 0, 1);
    },
    /* smoothstep */
    ease: function (t) { return t * t * (3 - 2 * t); },
    easeInOut: function (t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    },
    easeOut: function (t) { return 1 - Math.pow(1 - t, 3); },
    easeIn: function (t) { return t * t * t; },
    /* deterministic pseudo-random — same tooth gets the same flaws every frame */
    rand: function (seed) {
      var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    },
    /* Accepts '#abc', '#aabbcc' or 'rgb(r,g,b)'. Colour helpers get
       chained a lot (stain → whitening → gloss), so every one of
       them has to round-trip its own output. */
    parse: function (c) {
      if (c.charCodeAt(0) === 114) {          // 'r' — rgb(...)
        var m = c.match(/-?\d+(\.\d+)?/g);
        return [+m[0], +m[1], +m[2]];
      }
      var h = c.replace('#', '');
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      var n = parseInt(h, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    },
    rgba: function (c, a) {
      var p = U.parse(c);
      return 'rgba(' + p[0] + ',' + p[1] + ',' + p[2] + ',' + a + ')';
    },
    mix: function (ca, cb, t) {
      var a = U.parse(ca), b = U.parse(cb);
      return 'rgb(' +
        Math.round(U.lerp(a[0], b[0], t)) + ',' +
        Math.round(U.lerp(a[1], b[1], t)) + ',' +
        Math.round(U.lerp(a[2], b[2], t)) + ')';
    }
  };

  global.SDG.util = U;
})(window);
