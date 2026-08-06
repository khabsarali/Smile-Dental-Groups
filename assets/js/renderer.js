/* ============================================================
   renderer.js — draws the whole narrative for a given scroll
   progress. Pure function of (progress, time): scrolling up
   reverses everything for free, because nothing is stateful.
   ============================================================ */
(function (global) {
  'use strict';

  var U = global.SDG.util;
  var CFG = global.SDG.config;
  var A = global.SDG.arch;
  var S = global.SDG.scenes;
  var I = global.SDG.instruments;

  var TAU = Math.PI * 2;

  /* Treatment sweep layout: five instrument heads in formation,
     `LEAD` columns apart, marching across a 16-column arch. */
  var SPAN = A.COLS - 1;
  var LEAD = 2.4;
  var TRAVEL = SPAN + LEAD * 4 + 5;
  var START = -2.5;

  /* Crowns lean labially off the arch; this is the outward
     component of the tooth axis, shared by the renderer and the
     instrument docking so the tools land on the biting edge. */
  var FLARE = 0.24;

  function crownAxis(angle, dir) {
    var ax = FLARE * Math.sin(angle);
    var az = FLARE * Math.cos(angle);
    var len = Math.sqrt(ax * ax + az * az + 1);
    return { x: ax / len, y: dir / len, z: az / len };
  }

  function Renderer(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.teeth = A.build();
    this.dpr = 1;
    this.vw = 1600;
    this.vh = 900;
    this.parallax = { x: 0, y: 0, tx: 0, ty: 0 };
    this.state = { chapter: 'hero', tp: 0, tool: 0, tooth: 1 };

    if (CFG.effects) {
      this.fx = document.createElement('canvas');
      this.fxCtx = this.fx.getContext('2d');
    }
    this.resize();
  }

  Renderer.prototype.resize = function () {
    var cw = this.canvas.clientWidth || window.innerWidth;
    var ch = this.canvas.clientHeight || window.innerHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, CFG.maxDpr);

    this.canvas.width = Math.round(cw * dpr);
    this.canvas.height = Math.round(ch * dpr);
    this.dpr = dpr;

    /* Cover-fit an elastic world: the authored 1600×900 box always
       fills the viewport, and the world simply extends past it. */
    var scale = Math.max(cw / CFG.world.w, ch / CFG.world.h);
    this.scale = scale;
    this.vw = cw / scale;
    this.vh = ch / scale;

    if (this.fx) {
      /* Bloom source is a sixth-res copy; any more resolution is
         thrown away by the blur that follows it anyway. */
      this.fx.width = Math.max(2, Math.round(cw * 0.17));
      this.fx.height = Math.max(2, Math.round(ch * 0.17));
    }
  };

  Renderer.prototype.pointer = function (nx, ny) {
    this.parallax.tx = nx;
    this.parallax.ty = ny;
  };

  /* ── Per-frame derived state ─────────────────────────────── */
  function timeline(p) {
    var t = {};

    /* Face */
    var heroPush = U.easeIn(U.norm(p, 0, 0.12));
    var entryPush = U.easeIn(U.norm(p, 0.12, 0.235));
    var out = U.norm(p, 0.88, 1);

    /* Relative to the viewport-derived base zoom applied in frame():
       1.0 is "a cinematic close-up", and the entry push takes the
       lips well past the frame edge from there. */
    t.faceZoom = p < 0.5
      ? U.lerp(1, 1.3, heroPush) * (1 + entryPush * 5.4)
      : U.lerp(6.93, 1.013, U.easeOut(U.norm(out, 0, 0.86)));
    /* Both ends put the face right of centre so the copy owns the
       left third — the outro bookends the hero. */
    t.faceCx = p < 0.5
      ? U.lerp(0.65, 0.5, U.easeInOut(U.norm(p, 0.07, 0.2)))
      : U.lerp(0.5, 0.65, U.easeInOut(U.norm(out, 0.25, 0.95)));

    t.faceOpen = p < 0.5
      ? U.easeInOut(U.norm(p, 0.055, 0.17))
      : U.lerp(1, 0.54, U.easeInOut(U.norm(out, 0.30, 0.92)));

    t.faceAlpha = p < 0.5
      ? 1 - U.easeInOut(U.norm(p, 0.165, 0.245))
      : U.easeInOut(U.norm(out, 0.08, 0.58));

    t.smile = U.easeOut(U.norm(out, 0.40, 0.94));
    t.warmth = p < 0.5
      ? U.lerp(0.55, 0, U.norm(p, 0.02, 0.14))
      : U.easeInOut(U.norm(out, 0.18, 0.9));

    /* Arch */
    t.archAlpha = p < 0.5
      ? U.easeInOut(U.norm(p, 0.15, 0.245))
      : 1 - U.easeInOut(U.norm(out, 0.04, 0.52));

    /* daylight → operatory lamp */
    t.clinical = U.easeInOut(U.norm(p, 0.14, 0.26)) * (1 - U.easeInOut(U.norm(out, 0.1, 0.7)));

    /* X-ray */
    var xp = U.norm(p, 0.25, 0.40);
    t.xp = xp;
    t.scanT = U.easeInOut(U.norm(xp, 0.02, 0.58));
    t.scanActive = xp > 0 && xp < 1 ? 1 : 0;
    t.xrayFade = 1 - U.easeInOut(U.norm(xp, 0.84, 1));
    t.calloutFade = U.easeInOut(U.norm(xp, 0.30, 0.46)) * (1 - U.easeInOut(U.norm(xp, 0.80, 0.98)));

    /* Treatment */
    var tp = U.norm(p, 0.40, 0.75);
    t.tp = tp;
    t.heads = [];
    for (var i = 0; i < 5; i++) t.heads.push(START + tp * TRAVEL - i * LEAD);

    /* Reveal */
    var rp = U.norm(p, 0.75, 0.88);
    t.rp = rp;
    t.orbit = U.easeInOut(U.norm(rp, 0.02, 0.74)) * TAU;
    t.bloom = U.norm(rp, 0.28, 0.64);

    /* Jaw separation. Intake and diagnostics run it wide — partly
       because that is what a mouth prop does, partly because the
       void between the arches is where those two chapters put their
       copy and it has to be tall enough to hold it. Treatment
       tightens so both arches frame the working area, the orbit
       reopens, and the bite check closes it. */
    var narrow = U.easeInOut(U.norm(p, 0.395, 0.46));
    var reopen = U.easeInOut(U.norm(p, 0.715, 0.775));
    t.gap = U.lerp(U.lerp(1.5, 0.62, narrow), 0.92, reopen) *
            (1 - U.easeInOut(U.norm(rp, 0.70, 1)));

    /* Arch camera */
    var zoomIn = U.easeInOut(U.norm(p, 0.15, 0.245));
    var macro = U.easeInOut(U.norm(p, 0.40, 0.47)) * (1 - U.easeInOut(U.norm(p, 0.70, 0.755)));
    var pullOut = U.easeInOut(U.norm(out, 0.02, 0.55));
    /* Diagnostics is the only chapter that has to fit the roots as
       well as the crowns, and with the bite wide open that is a
       taller subject than any other frame. Ease back for it. */
    var roots = U.easeInOut(U.norm(p, 0.25, 0.31)) *
                (1 - U.easeInOut(U.norm(p, 0.38, 0.43)));

    t.archZoom = U.lerp(0.42, 1, zoomIn) * (1 + macro * 0.12) *
                 U.lerp(1, 0.86, roots) *
                 U.lerp(1, 1.26, U.easeInOut(U.norm(rp, 0, 0.8))) *
                 U.lerp(1, 0.5, pullOut);
    t.pan = macro;
    t.pitch = U.lerp(0.44, 0.26, U.easeInOut(U.norm(p, 0.15, 0.42)));

    return t;
  }

  Renderer.prototype.frame = function (p, time) {
    var ctx = this.ctx;
    var W = this.vw, H = this.vh;
    var t = timeline(p);
    var beat = time * 0.001;

    /* eased pointer parallax — tiny, just enough to feel alive */
    this.parallax.x += (this.parallax.tx - this.parallax.x) * 0.06;
    this.parallax.y += (this.parallax.ty - this.parallax.y) * 0.06;

    ctx.setTransform(this.scale * this.dpr, 0, 0, this.scale * this.dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#050c14';
    ctx.fillRect(0, 0, W, H);

    /* ── Face layer ──────────────────────────────────────── */
    if (t.faceAlpha > 0.004) {
      ctx.save();
      ctx.globalAlpha = t.faceAlpha;
      ctx.translate(this.parallax.x * 14, this.parallax.y * 10);
      /* The face is authored in absolute world units, so its scale has
         to be derived from the viewport or portrait gets a nostril.
         Portrait also centres it and rides higher, because the copy
         layer takes the bottom band there instead of the left third. */
      var tall = H > W;
      S.drawFace(ctx, W, H, {
        zoom: t.faceZoom * (W / (tall ? 660 : 960)),
        cx: tall ? 0.5 : t.faceCx,
        cy: tall ? 0.37 : 0.44,
        warmth: t.warmth,
        smile: t.smile,
        open: t.faceOpen
      });
      ctx.restore();
    }

    /* ── Arch layer ──────────────────────────────────────── */
    if (t.archAlpha > 0.004) {
      ctx.save();
      ctx.globalAlpha = t.archAlpha;
      this.drawArchScene(ctx, W, H, t, beat, p);
      ctx.restore();
    }

    /* ── Grade + bloom ───────────────────────────────────── */
    if (this.fx && t.archAlpha > 0.05) this.bloom(ctx, W, H, 0.1 * t.archAlpha);

    /* Report the instrument nearest the middle of the arch — the one
       the eye is actually on — rather than the leading or trailing
       head, which would pin the readout to one tool all sweep. */
    this.state.chapter = chapterAt(p).id;
    this.state.tp = t.tp;
    var mid = SPAN / 2, best = -1, bestD = 1e9;
    for (var i = 0; i < 5; i++) {
      if (t.heads[i] < -1 || t.heads[i] > SPAN + 1) continue;
      var d = Math.abs(t.heads[i] - mid);
      if (d < bestD) { bestD = d; best = i; }
    }
    if (best >= 0) {
      this.state.tool = best;
      this.state.tooth = U.clamp(Math.round(t.heads[best]), 0, SPAN) + 1;
    }
  };

  Renderer.prototype.drawArchScene = function (ctx, W, H, t, beat, p) {
    var teeth = this.teeth;

    S.drawCavity(ctx, W, H, t.clinical);

    var cam = {
      orbit: t.orbit,
      pitch: t.pitch,
      dist: 820,
      fl: 900,
      zoom: (W / CFG.world.w) * 1.32 * t.archZoom,
      cx: W * 0.5 + this.parallax.x * 26,
      /* Lift the arch during treatment: the instrument shafts hang
         down out of frame, and the copy needs the bottom band.
         Portrait already sits it higher (see below), so the two
         lifts are combined here rather than stacked. */
      cy: H * (U.lerp(0.5, 0.42, t.pan) - (H > W ? 0.045 : 0)),
      shiftY: this.parallax.y * 16
    };

    /* Portrait has width to spare nowhere and height to spare
       everywhere: push in so the arch fills the frame, and open the
       bite wider so the two jaws use the vertical room. */
    var portrait = H > W ? U.clamp(H / W / 1.2, 1, 1.55) : 1;
    cam.zoom *= portrait;
    var gap = t.gap;
    var spread = 1 + (portrait - 1) * 1.1;
    var yUpper = -(68 + 86 * gap) * spread;
    var yLower = (60 + 84 * gap) * spread;

    /* Where an instrument tip has to land to sit on the upper
       arch's biting edge at a given (fractional) column. */
    function dockAt(u) {
      var pt = A.pointAtColumn(u);
      var ax = crownAxis(pt.a, 1);
      return {
        x: pt.x + ax.x * pt.h,
        y: yUpper + ax.y * pt.h,
        z: pt.z + ax.z * pt.h
      };
    }

    /* Camera drifts with the instrument formation during treatment.
       Only a fraction of the way — tracking it 1:1 swings the arch
       off one side of the frame and leaves the other side empty. */
    if (t.pan > 0.001) {
      var head = dockAt(U.clamp(t.heads[2], 0, SPAN));
      var hp = A.project(cam, head.x, head.y, head.z);
      cam.cx += (W * 0.5 - hp.x) * t.pan * 0.3;
    }

    /* --- gums, behind everything --- */
    /* Offset the band away from the biting edges — centred on the
       gum line, half of its width lies over the crowns and the arch
       reads as teeth threaded onto a pink cord. */
    var gumHealth = U.clamp(t.tp * 1.35, 0, 1);
    A.drawGums(ctx, cam, yUpper - 15, gumHealth, 1, 1);
    A.drawGums(ctx, cam, yLower + 15, gumHealth, 1, 1);

    /* --- x-ray wipe: everything left of the beam goes radiographic --- */
    var barX = U.lerp(-W * 0.1, W * 1.1, t.scanT);
    var xrayOn = t.xrayFade * (t.xp > 0 ? 1 : 0);

    if (xrayOn > 0.01) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, Math.max(0, barX), H);
      ctx.clip();
      /* the operatory light drops away behind the beam */
      ctx.fillStyle = 'rgba(4,10,17,' + (xrayOn * 0.8).toFixed(3) + ')';
      ctx.fillRect(0, 0, W, H);
      /* jawbone plate behind the roots */
      A.drawGums(ctx, cam, yUpper - 74, 1, xrayOn * 0.3, 3.4, true);
      A.drawGums(ctx, cam, yLower + 74, 1, xrayOn * 0.3, 3.4, true);
      ctx.globalCompositeOperation = 'lighter';
      var bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, 'rgba(20,58,88,' + (xrayOn * 0.34).toFixed(3) + ')');
      bg.addColorStop(1, 'rgba(8,24,40,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    /* --- project + depth-sort every tooth --- */
    var list = [];
    for (var i = 0; i < teeth.length; i++) {
      var tooth = teeth[i];
      var yJaw = tooth.jaw === 'upper' ? yUpper : yLower;
      var dir = tooth.jaw === 'upper' ? 1 : -1;    // crowns grow toward the midline
      var ax = crownAxis(tooth.angle, dir);

      var base = A.project(cam, tooth.x, yJaw, tooth.z);
      var tip = A.project(cam,
        tooth.x + ax.x * tooth.h,
        yJaw + ax.y * tooth.h,
        tooth.z + ax.z * tooth.h);

      var dx = tip.x - base.x, dy = tip.y - base.y;
      base.axis = Math.atan2(dx, -dy);
      base.w = tooth.w * base.s;
      base.h = Math.sqrt(dx * dx + dy * dy);
      base.beat = beat * 4;
      list.push({ t: tooth, pr: base });
    }
    list.sort(function (a, b) { return a.pr.depth - b.pr.depth; });

    /* --- draw --- */
    var callouts = [];
    for (var j = 0; j < list.length; j++) {
      var it = list[j];
      var tt = it.t, pr = it.pr;

      var stages = [];
      for (var s = 0; s < 5; s++) {
        stages.push(U.clamp(t.heads[s] - tt.k + 0.5, 0, 1));
      }
      var ap = A.appearance(tt, stages);

      /* a missing tooth is a socket until the crown is placed */
      if (tt.missing && ap.crown < 0.02) {
        this.drawSocket(ctx, pr);
        if (tt.finding) callouts.push({ tt: tt, pr: pr });
        continue;
      }
      if (tt.missing) {
        pr.w *= U.easeOut(ap.crown);
        pr.h *= U.easeOut(ap.crown);
      }

      var cover = xrayOn > 0.01
        ? xrayOn * U.clamp((barX - pr.x) / 70, 0, 1)
        : 0;

      if (cover < 0.99) {
        ctx.save();
        ctx.globalAlpha = 1 - cover;
        A.drawTooth(ctx, tt, pr, ap, { orbit: t.orbit });
        ctx.restore();
      }
      if (cover > 0.01) {
        A.drawToothXray(ctx, tt, pr, ap, cover);
      }
      if (tt.finding) callouts.push({ tt: tt, pr: pr });
    }

    /* --- the beam itself --- */
    if (t.scanActive && t.scanT > 0 && t.scanT < 1) {
      S.drawScanBar(ctx, W, H, barX, U.clamp(t.xrayFade, 0, 1));
    }

    /* --- clinical callouts, stacked in the right-hand gutter --- */
    if (t.calloutFade > 0.01 && callouts.length) {
      /* Rows sit at each finding's own height, then get pushed apart
         only as far as they must. Fixed rows produce leaders that rake
         across the whole frame and cross each other. */
      var tight = W < 620;
      var gutterX = W - (tight ? 108 : 176);
      var minGap = tight ? 46 : 58;
      var top = tight ? 88 : 56;
      /* portrait reserves the bottom for copy, so rows stay up high */
      var bottom = tight ? H * 0.6 : H - 56;

      callouts.sort(function (a, b) { return a.pr.y - b.pr.y; });
      var rows = [], c;
      for (c = 0; c < callouts.length; c++) {
        var want = U.clamp(callouts[c].pr.y, top, bottom);
        if (c && want - rows[c - 1] < minGap) want = rows[c - 1] + minGap;
        rows.push(want);
      }
      /* if pushing down overflowed, lift the whole stack */
      var over = rows[rows.length - 1] - bottom;
      if (over > 0) for (c = 0; c < rows.length; c++) rows[c] -= over;

      for (c = 0; c < callouts.length; c++) {
        var co = callouts[c];
        var a2 = t.calloutFade * U.clamp((barX - co.pr.x) / 140, 0, 1);
        var f = co.tt.finding;
        S.drawCallout(ctx, co.pr.x, co.pr.y,
          tight ? f.short : f.label, '#' + String(co.tt.id).padStart(2, '0'),
          a2, gutterX, rows[c], 1, tight);
      }
    }

    /* --- instruments, coming up onto the arch from below-left --- */
    if (t.tp > 0 && t.tp < 1) {
      for (var k = 0; k < 5; k++) {
        var hc = t.heads[k];
        if (hc < -2 || hc > SPAN + 2) continue;
        var dp = dockAt(U.clamp(hc, 0, SPAN));
        var pp = A.project(cam, dp.x, dp.y, dp.z);
        var enter = Math.min(
          U.clamp((hc + 2) / 1.6, 0, 1),
          U.clamp((SPAN + 2 - hc) / 1.6, 0, 1)
        );
        I.draw(ctx, k, pp.x, pp.y, pp.s * 0.9, beat, enter,
               Math.PI - 0.05 + k * 0.025, -300, 200);
      }
    }

    /* --- whitening bloom over the finished arch --- */
    S.drawBloom(ctx, W, H, t.bloom);
  };

  Renderer.prototype.drawSocket = function (ctx, pr) {
    ctx.save();
    ctx.translate(pr.x, pr.y);
    ctx.rotate(pr.axis);
    var w = pr.w, h = pr.h;
    var g = ctx.createRadialGradient(0, -h * 0.1, 1, 0, -h * 0.1, w * 0.7);
    g.addColorStop(0, '#12060a');
    g.addColorStop(0.6, '#3a1218');
    g.addColorStop(1, 'rgba(58,18,24,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.1, w * 0.5, h * 0.26, 0, 0, 6.284);
    ctx.fill();
    ctx.restore();
  };

  /* Cheap bloom: quarter-res copy, threshold via filter, added back. */
  Renderer.prototype.bloom = function (ctx, W, H, amount) {
    var fx = this.fxCtx;
    if (!fx) return;
    try {
      fx.setTransform(1, 0, 0, 1, 0, 0);
      fx.clearRect(0, 0, this.fx.width, this.fx.height);
      fx.filter = 'blur(5px) brightness(1.15) contrast(2.6) saturate(0.9)';
      fx.drawImage(this.canvas, 0, 0, this.fx.width, this.fx.height);
      fx.filter = 'none';
    } catch (e) { this.fx = null; return; }

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = amount;
    ctx.drawImage(this.fx, 0, 0, W, H);
    ctx.restore();
  };

  function chapterAt(p) {
    var ch = CFG.chapters;
    for (var i = 0; i < ch.length; i++) {
      if (p < ch[i].to || i === ch.length - 1) return ch[i];
    }
    return ch[0];
  }

  global.SDG.Renderer = Renderer;
  global.SDG.chapterAt = chapterAt;
})(window);
