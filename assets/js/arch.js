/* ============================================================
   arch.js — a full 32-tooth arch as billboarded, depth-sorted
   crowns on a parametric curve, with a tiny perspective camera.

   Deliberately NOT a real-time 3D scene: every tooth is a 2D path
   drawn at a projected position and scale. Thirty-two paths per
   frame costs nothing, survives a 720p phone, and keeps the
   surgical detail that a low-poly mesh would throw away.
   ============================================================ */
(function (global) {
  'use strict';

  var U = global.SDG.util;
  var P = global.SDG.config.palette;

  var COLS = 16;              // teeth per jaw
  var THETA = 1.36;           // half-angle of the arch, radians
  var RX = 330;               // arch half-width
  var RZ = 215;               // arch depth (front teeth sit closest)

  /* Universal numbering, laid out left→right as the viewer sees it.
     Upper: #1 (patient's upper right 3rd molar) is on screen-left.
     Lower: #32 (patient's lower right 3rd molar) is on screen-left. */
  function universal(jaw, k) { return jaw === 'upper' ? k + 1 : 32 - k; }

  /* Tooth type by position in the arch (mirrored about the midline). */
  function typeOf(k) {
    var m = k < 8 ? k : 15 - k;
    if (m <= 2) return 'molar';
    if (m <= 4) return 'premolar';
    if (m === 5) return 'canine';
    if (m === 6) return 'lateral';
    return 'central';
  }

  var METRICS = {
    molar:    { w: 1.18, h: 0.68, cusps: 3, point: 0.055, roots: 2 },
    premolar: { w: 0.86, h: 0.80, cusps: 2, point: 0.10, roots: 1 },
    canine:   { w: 0.82, h: 1.06, cusps: 1, point: 0.20, roots: 1 },
    lateral:  { w: 0.76, h: 0.85, cusps: 0, point: 0.05, roots: 1 },
    central:  { w: 0.98, h: 1.00, cusps: 0, point: 0.04, roots: 1 }
  };

  /* ── The case ────────────────────────────────────────────────
     Findings are fixed so the callouts in the copy stay true. */
  var FINDINGS = {
    14: { kind: 'caries',     label: 'Caries',          short: 'Caries' },
    19: { kind: 'fracture',   label: 'Fracture',        short: 'Fracture' },
    30: { kind: 'extraction', label: 'Extraction site', short: 'Extraction' }
  };

  /* ── Arc-length layout ───────────────────────────────────────
     Spacing teeth evenly *in angle* crowds the molars into each
     other, because the ellipse runs almost parallel to the view
     axis out there. Walk the curve and hand each tooth a slice of
     real arc length proportional to its width instead. */
  var CURVE = (function () {
    var STEPS = 900;
    var s = [0], a = [-THETA];
    var px = RX * Math.sin(-THETA), pz = RZ * Math.cos(-THETA);
    for (var i = 1; i <= STEPS; i++) {
      var ang = -THETA + (2 * THETA * i) / STEPS;
      var x = RX * Math.sin(ang), z = RZ * Math.cos(ang);
      s.push(s[i - 1] + Math.hypot(x - px, z - pz));
      a.push(ang);
      px = x; pz = z;
    }
    return { s: s, a: a, length: s[STEPS] };
  })();

  /* arc length → arch angle */
  function angleAt(len) {
    var s = CURVE.s;
    var lo = 0, hi = s.length - 1;
    if (len <= 0) return CURVE.a[0];
    if (len >= CURVE.length) return CURVE.a[hi];
    while (hi - lo > 1) {
      var mid = (lo + hi) >> 1;
      if (s[mid] < len) lo = mid; else hi = mid;
    }
    var t = (len - s[lo]) / (s[hi] - s[lo] || 1);
    return U.lerp(CURVE.a[lo], CURVE.a[hi], t);
  }

  /* Continuous position along the arch in *column* units (0..15),
     plus the interpolated crown height there so an instrument tip
     lands on the biting edge of a molar as well as an incisor. */
  function pointAtColumn(u) {
    var f = U.clamp(u / (COLS - 1), -0.15, 1.15);
    var a = angleAt(f * CURVE.length);
    var c = U.clamp(u, 0, COLS - 1);
    var i0 = Math.floor(c), i1 = Math.min(COLS - 1, i0 + 1);
    var h = U.lerp(METRICS[typeOf(i0)].h, METRICS[typeOf(i1)].h, c - i0) * 68;
    return { x: RX * Math.sin(a), z: RZ * Math.cos(a), a: a, h: h };
  }

  function build() {
    var teeth = [];
    var widths = [];
    var total = 0;
    for (var k = 0; k < COLS; k++) {
      var wv = METRICS[typeOf(k)].w;
      widths.push(wv);
      total += wv;
    }

    ['upper', 'lower'].forEach(function (jaw) {
      var run = 0;
      for (var k = 0; k < COLS; k++) {
        var id = universal(jaw, k);
        var type = typeOf(k);
        var m = METRICS[type];

        var share = (widths[k] / total) * CURVE.length;
        var a = angleAt(run + share / 2);
        run += share;

        var seed = id * 7.13 + (jaw === 'upper' ? 0 : 41.7);
        var finding = FINDINGS[id] || null;

        teeth.push({
          id: id,
          k: k,
          jaw: jaw,
          type: type,
          angle: a,
          x: RX * Math.sin(a),
          z: RZ * Math.cos(a),
          w: share * 0.9,                       // 10% for the contact point
          h: m.h * (jaw === 'upper' ? 68 : 60),
          cusps: m.cusps,
          point: m.point,
          roots: m.roots,
          seed: seed,
          finding: finding,
          missing: finding && finding.kind === 'extraction',
          /* Baseline pathology — deterministic, so a tooth never
             re-rolls its flaws between frames. */
          stain: 0.30 + U.rand(seed) * 0.5,
          plaque: 0.28 + U.rand(seed + 3) * 0.55,
          chip: U.rand(seed + 9) > 0.6 ? 0.16 + U.rand(seed + 11) * 0.22 : 0,
          chipSide: U.rand(seed + 13) > 0.5 ? 1 : -1,
          tilt: (U.rand(seed + 23) - 0.5) * 0.07
        });
      }
    });
    return teeth;
  }

  /* ── Camera ──────────────────────────────────────────────────
     Yaw around Y for the reveal orbit, a fixed downward pitch so
     you read the arch as a curve rather than a row. */
  function project(cam, x, y, z) {
    var co = Math.cos(cam.orbit), so = Math.sin(cam.orbit);
    var rx = x * co + z * so;
    var rz = -x * so + z * co;

    var cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    var ry = y * cp - rz * sp;
    var rz2 = y * sp + rz * cp;

    var denom = cam.dist - rz2;
    if (denom < 60) denom = 60;
    var s = (cam.fl / denom) * cam.zoom;

    return {
      x: cam.cx + rx * s,
      y: cam.cy + ry * s + cam.shiftY,
      s: s,
      depth: rz2
    };
  }

  /* ── Crown geometry ──────────────────────────────────────────
     Drawn in a local frame: origin at the gum line, -y toward the
     biting edge. Works on a CanvasRenderingContext2D or a Path2D,
     so the same outline can fill, stroke and clip. */
  /* A chip is baked into the outline rather than punched out of it.
     Subtracting a wedge with the evenodd rule paints whatever part
     of the wedge falls outside the crown — you get a floating shard
     instead of a missing corner. */
  function crownPath(sink, w, h, cusps, point, chip, chipSide) {
    var hw = w / 2;
    var neck = hw * 0.80;          // narrower where it leaves the gum
    var r = hw * 0.26;

    var amt = chip > 0.02 ? chip : 0;
    var cw = amt ? hw * (0.4 + amt * 0.8) : 0;
    var left = amt && chipSide < 0;
    var right = amt && chipSide > 0;

    /* where the incisal traverse starts and ends, pulled inboard on
       whichever side has lost a corner */
    var x0 = -hw * 0.7 + (left ? cw : 0);
    var x1 = hw * 0.7 - (right ? cw : 0);

    if (sink.beginPath) sink.beginPath();
    sink.moveTo(-neck, 4);

    if (left) {
      sink.bezierCurveTo(-hw, -h * 0.26, -hw, -h * 0.5, -hw * 0.99, -h + h * amt * 1.3);
      sink.lineTo(x0, -h);
    } else {
      sink.bezierCurveTo(-hw, -h * 0.26, -hw, -h * 0.5, -hw * 0.98, -h + r);
      sink.quadraticCurveTo(-hw * 0.96, -h, x0, -h);
    }

    if (cusps === 0) {
      /* incisor: near-flat incisal edge with a faint mamelon dip */
      sink.quadraticCurveTo((x0 + x1) / 2, -h - h * point * 1.4, x1, -h);
    } else if (cusps === 1) {
      /* canine: single cusp tip */
      var mid = (x0 + x1) / 2;
      sink.lineTo(mid - hw * 0.24, -h - h * point * 0.35);
      sink.quadraticCurveTo(mid, -h - h * point * 1.15, mid + hw * 0.24, -h - h * point * 0.35);
      sink.lineTo(x1, -h);
    } else {
      /* premolar / molar: repeating cusps across the occlusal table */
      var step = (x1 - x0) / cusps;
      for (var i = 0; i < cusps; i++) {
        var xm = x0 + step * (i + 0.5);
        var xe = x0 + step * (i + 1);
        sink.quadraticCurveTo(xm, -h - h * point * 1.6, xe, -h + h * 0.04);
      }
    }

    if (right) {
      sink.lineTo(hw * 0.99, -h + h * amt * 1.3);
      sink.bezierCurveTo(hw, -h * 0.5, hw, -h * 0.26, neck, 4);
    } else {
      sink.quadraticCurveTo(hw * 0.96, -h, hw * 0.98, -h + r);
      sink.bezierCurveTo(hw, -h * 0.5, hw, -h * 0.26, neck, 4);
    }
    sink.closePath();
  }

  function rootPath(sink, w, h, roots) {
    var hw = w / 2;
    var L = h * 1.2;
    if (sink.beginPath) sink.beginPath();
    if (roots === 1) {
      sink.moveTo(-hw * 0.8, 0);
      sink.quadraticCurveTo(-hw * 0.6, L * 0.6, -hw * 0.24, L);
      sink.quadraticCurveTo(0, L * 1.1, hw * 0.24, L);
      sink.quadraticCurveTo(hw * 0.6, L * 0.6, hw * 0.8, 0);
    } else {
      sink.moveTo(-hw * 0.92, 0);
      sink.quadraticCurveTo(-hw * 0.92, L * 0.62, -hw * 0.56, L * 0.94);
      sink.quadraticCurveTo(-hw * 0.42, L * 1.04, -hw * 0.3, L * 0.9);
      sink.quadraticCurveTo(-hw * 0.22, L * 0.42, 0, L * 0.26);
      sink.quadraticCurveTo(hw * 0.22, L * 0.42, hw * 0.3, L * 0.9);
      sink.quadraticCurveTo(hw * 0.42, L * 1.04, hw * 0.56, L * 0.94);
      sink.quadraticCurveTo(hw * 0.92, L * 0.62, hw * 0.92, 0);
    }
    sink.closePath();
  }

  /* ── Appearance from treatment state ─────────────────────────
     `stages` is five 0..1 values, one per instrument pass:
     0 scale · 1 prep · 2 fill · 3 cure · 4 polish. */
  function appearance(t, stages) {
    var scaled = stages[0], prepped = stages[1], filled = stages[2],
        cured = stages[3], polished = stages[4];

    return {
      plaque: t.plaque * (1 - scaled),
      /* prep cuts the lesion out — the tooth briefly looks worse */
      defect: t.finding && t.finding.kind !== 'extraction'
        ? U.clamp(1 - filled, 0, 1) : 0,
      prep: prepped * (1 - filled),
      stain: t.stain * (1 - polished * 0.95) * (1 - cured * 0.3),
      chip: t.chip * (1 - filled),
      gloss: 0.12 + cured * 0.3 + polished * 0.58,
      bright: polished,
      /* the extraction site takes a crown at the fill stage */
      crown: t.missing ? filled : 0,
      health: U.clamp((scaled + polished) / 2, 0, 1)
    };
  }

  /* ── One tooth, visible light ────────────────────────────── */
  function drawTooth(ctx, t, pr, ap, opts) {
    /* pr.w / pr.h are the *projected* crown box: width from the
       perspective scale at the gum line, height from the screen
       distance between gum line and biting edge, so teeth at the
       back of the arch foreshorten correctly. */
    var w = pr.w, h = pr.h, s = pr.s;
    if (w < 0.8 || h < 0.8) return;

    ctx.save();
    ctx.translate(pr.x, pr.y);
    ctx.rotate(pr.axis + t.tilt * (1 - Math.abs(Math.sin(opts.orbit))));

    /* gum collar first, so the crown sits into it rather than on it */
    ctx.save();
    var gum = U.mix('#a8515c', '#b8767f', ap.health);
    ctx.fillStyle = gum;
    ctx.beginPath();
    ctx.ellipse(0, 2, w * 0.56, h * 0.13, 0, 0, 6.284);
    ctx.fill();
    ctx.restore();

    var path = new Path2D();
    crownPath(path, w, h, t.cusps, t.point, ap.chip, t.chipSide);

    /* soft occlusion under the crown */
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = 'rgba(24,10,14,0.9)';
    ctx.translate(0, 1.5);
    ctx.fill(path);
    ctx.restore();

    /* Every layer below fills the crown path itself rather than
       clipping to it and filling a rect. Thirty-two clips a frame is
       thirty-two save-layers in the rasteriser — it was costing ~4ms
       per tooth. Same pixels, no layers. */

    /* --- enamel: cervical warmth → bright body → translucent edge --- */
    var body = U.mix('#f2f4ef', '#e3d3ae', ap.stain);
    body = U.mix(body, '#ffffff', ap.bright * 0.3);
    var cervical = U.mix(body, '#c9a273', 0.35 + ap.stain * 0.3);
    var incisal = t.cusps === 0
      ? U.mix(body, '#9fb6c4', 0.42 - ap.bright * 0.16)
      : U.mix(body, '#c8d3d8', 0.2);

    var vg = ctx.createLinearGradient(0, 6, 0, -h * 1.05);
    vg.addColorStop(0, cervical);
    vg.addColorStop(0.32, body);
    vg.addColorStop(0.82, U.mix(body, '#ffffff', 0.35));
    vg.addColorStop(1, incisal);
    ctx.fillStyle = vg;
    ctx.fill(path);

    /* cylindrical shading — dark at both edges, open in the middle */
    var hg = ctx.createLinearGradient(-w * 0.5, 0, w * 0.5, 0);
    hg.addColorStop(0, 'rgba(38,58,72,0.58)');
    hg.addColorStop(0.2, 'rgba(38,58,72,0.05)');
    hg.addColorStop(0.62, 'rgba(38,58,72,0)');
    hg.addColorStop(0.88, 'rgba(38,58,72,0.16)');
    hg.addColorStop(1, 'rgba(38,58,72,0.56)');
    ctx.fillStyle = hg;
    ctx.fill(path);

    /* Level of detail. Under ~13px wide a crown is a sliver at the
       back of the arch or the far side of an orbit; the stain,
       plaque, lesion and specular passes cost the same as they do on
       a central incisor and land on about forty pixels. */
    if (w < 13) {
      ctx.lineWidth = Math.max(0.4, s * 0.4);
      ctx.strokeStyle = U.rgba('#0b1a24', 0.3);
      ctx.stroke(path);
      ctx.restore();
      return;
    }

    /* interproximal staining, worst before scaling */
    if (ap.stain > 0.06) {
      ctx.save();
      ctx.globalAlpha = ap.stain * 0.5;
      var sg = ctx.createLinearGradient(0, 4, 0, -h * 0.6);
      sg.addColorStop(0, 'rgba(112,80,38,0.9)');
      sg.addColorStop(1, 'rgba(112,80,38,0)');
      ctx.fillStyle = sg;
      ctx.fill(path);
      ctx.restore();
    }

    /* the lesion / fracture itself */
    if (ap.defect > 0.02 && t.finding) {
      ctx.save();
      ctx.globalAlpha = ap.defect;
      if (t.finding.kind === 'caries') {
        var dg = ctx.createRadialGradient(w * 0.08, -h * 0.72, 1, w * 0.08, -h * 0.72, w * 0.46);
        dg.addColorStop(0, '#160d05');
        dg.addColorStop(0.55, '#452c12');
        dg.addColorStop(1, 'rgba(69,44,18,0)');
        ctx.fillStyle = dg;
        ctx.fill(path);
      } else {
        ctx.strokeStyle = 'rgba(34,22,14,0.55)';
        ctx.lineWidth = Math.max(0.6, w * 0.024);
        ctx.beginPath();
        ctx.moveTo(-w * 0.14, -h * 1.02);
        ctx.bezierCurveTo(-w * 0.04, -h * 0.78, w * 0.02, -h * 0.62, -w * 0.02, -h * 0.42);
        ctx.bezierCurveTo(-w * 0.05, -h * 0.3, -w * 0.09, -h * 0.24, -w * 0.08, -h * 0.14);
        ctx.stroke();
      }
      ctx.restore();
    }

    /* freshly cut prep floor — matte, chalky, no gloss. Sits well
       inside the occlusal table, so it needs no clip of its own. */
    if (ap.prep > 0.02) {
      ctx.save();
      ctx.globalAlpha = ap.prep * 0.92;
      ctx.fillStyle = '#c6c6bf';
      ctx.beginPath();
      ctx.ellipse(w * 0.05, -h * 0.72, w * 0.26, h * 0.18, 0, 0, 6.284);
      ctx.fill();
      ctx.fillStyle = 'rgba(70,74,72,0.5)';
      ctx.beginPath();
      ctx.ellipse(w * 0.05, -h * 0.7, w * 0.16, h * 0.1, 0, 0, 6.284);
      ctx.fill();
      ctx.restore();
    }

    /* plaque film along the gum line */
    if (ap.plaque > 0.05) {
      ctx.save();
      ctx.globalAlpha = ap.plaque * 0.6;
      var pg = ctx.createLinearGradient(0, 3, 0, -h * 0.34);
      pg.addColorStop(0, 'rgba(224,212,158,0.95)');
      pg.addColorStop(0.9, 'rgba(224,212,158,0)');
      pg.addColorStop(1, 'rgba(224,212,158,0)');
      ctx.fillStyle = pg;
      ctx.fill(path);
      ctx.restore();
    }

    /* Specular: a narrow vertical band in a gradient filled on the
       crown, so the highlight stops exactly at the silhouette
       instead of needing an ellipse and a clip to contain it. */
    ctx.save();
    ctx.globalAlpha = 0.16 + ap.gloss * 0.46;
    var spec = ctx.createLinearGradient(-w * 0.4, 0, 0, 0);
    spec.addColorStop(0, 'rgba(255,255,255,0)');
    spec.addColorStop(0.42, 'rgba(255,255,255,0.16)');
    spec.addColorStop(0.6, 'rgba(255,255,255,0.85)');
    spec.addColorStop(0.78, 'rgba(255,255,255,0.1)');
    spec.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = spec;
    ctx.fill(path);
    /* a second, tighter hit on the incisal third */
    ctx.globalAlpha = ap.gloss * 0.4;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.ellipse(w * 0.1, -h * 0.84, w * 0.09, h * 0.045, 0, 0, 6.284);
    ctx.fill();
    ctx.restore();

    ctx.lineWidth = Math.max(0.45, s * 0.42);
    ctx.strokeStyle = U.rgba('#0b1a24', 0.22 + 0.16 * (1 - ap.gloss));
    ctx.stroke(path);

    ctx.restore();
  }

  /* ── One tooth, radiography ──────────────────────────────── */
  function drawToothXray(ctx, t, pr, ap, alpha) {
    var w = pr.w, h = pr.h, s = pr.s;
    if (w < 0.8) return;

    ctx.save();
    ctx.translate(pr.x, pr.y);
    ctx.rotate(pr.axis);
    ctx.globalAlpha = alpha;

    /* root + surrounding bone, on the far side of the gum line */
    var rp = new Path2D();
    rootPath(rp, w * 0.92, h, t.roots);

    ctx.save();
    ctx.globalAlpha = alpha * 0.7;
    ctx.fillStyle = 'rgba(126,178,212,0.30)';
    ctx.fill(rp);
    ctx.strokeStyle = 'rgba(196,232,255,0.42)';
    ctx.lineWidth = Math.max(0.5, s * 0.4);
    ctx.stroke(rp);

    /* nerve canal */
    ctx.strokeStyle = 'rgba(10,34,54,0.55)';
    ctx.lineWidth = Math.max(0.7, w * 0.055);
    ctx.beginPath();
    if (t.roots === 1) {
      ctx.moveTo(0, h * 0.1);
      ctx.quadraticCurveTo(0, h * 0.7, 0, h * 1.08);
    } else {
      ctx.moveTo(-w * 0.2, h * 0.14);
      ctx.quadraticCurveTo(-w * 0.28, h * 0.66, -w * 0.28, h * 1.0);
      ctx.moveTo(w * 0.2, h * 0.14);
      ctx.quadraticCurveTo(w * 0.28, h * 0.66, w * 0.28, h * 1.0);
    }
    ctx.stroke();
    ctx.restore();

    /* crown: translucent enamel shell over a denser dentine core */
    var path = new Path2D();
    crownPath(path, w, h, t.cusps, t.point);

    var eg = ctx.createLinearGradient(0, 6, 0, -h);
    eg.addColorStop(0, 'rgba(96,150,192,0.55)');
    eg.addColorStop(0.5, 'rgba(158,205,234,0.62)');
    eg.addColorStop(1, 'rgba(226,244,255,0.82)');
    ctx.fillStyle = eg;
    ctx.fill(path);

    ctx.strokeStyle = 'rgba(214,240,255,0.55)';
    ctx.lineWidth = Math.max(0.45, s * 0.4);
    ctx.stroke(path);

    /* pulp chamber — a radial gradient filled on the crown, so it
       fades out inside the silhouette without a clip */
    var pg2 = ctx.createRadialGradient(0, -h * 0.16, 1, 0, -h * 0.16, w * 0.34);
    pg2.addColorStop(0, 'rgba(12,36,56,0.3)');
    pg2.addColorStop(1, 'rgba(12,36,56,0)');
    ctx.fillStyle = pg2;
    ctx.fill(path);

    /* pathology glows amber and pulses */
    if (t.finding && ap.defect > 0.02) {
      var pulse = 0.5 + 0.5 * Math.sin(pr.beat + t.id);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alpha * ap.defect * pulse * 0.85;
      var ag = ctx.createRadialGradient(0, -h * 0.5, 1, 0, -h * 0.5, w * 0.85);
      ag.addColorStop(0, 'rgba(255,181,74,0.9)');
      ag.addColorStop(1, 'rgba(255,181,74,0)');
      ctx.fillStyle = ag;
      ctx.fillRect(-w * 1.2, -h * 1.7, w * 2.4, h * 2.6);
      ctx.restore();
    }

    ctx.restore();
  }

  /* ── Gum arch (drawn per jaw, behind the teeth) ───────────── */
  function drawGums(ctx, cam, yJaw, health, alpha, thickness, tint) {
    var pts = [];
    for (var i = 0; i <= 48; i++) {
      var a = -THETA - 0.1 + (2 * (THETA + 0.1) * i) / 48;
      pts.push(project(cam, RX * Math.sin(a) * 1.03, yJaw, RZ * Math.cos(a) * 1.03));
    }
    var unit = cam.zoom * (cam.fl / cam.dist);
    var t = (thickness || 1);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    /* `tint` swaps the soft tissue for radiographic bone, which is
       the same band geometry in a completely different palette. */
    var outer = tint ? '#183c58' : U.mix('#6a333a', '#7b444a', health);
    var inner = tint ? '#2d6b93' : U.mix('#a8515c', '#b8767f', health);
    var edge = tint ? U.rgba('#8fc4e2', 0.45) : U.rgba('#d9979d', 0.5);

    var passes = [
      { w: 30 * unit * t, c: outer },
      { w: 19 * unit * t, c: inner },
      { w: 8 * unit * t, c: edge }
    ];
    for (var p = 0; p < passes.length; p++) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (var j = 1; j < pts.length; j++) ctx.lineTo(pts[j].x, pts[j].y);
      ctx.lineWidth = passes[p].w;
      ctx.strokeStyle = passes[p].c;
      ctx.stroke();
    }
    ctx.restore();
  }

  global.SDG.arch = {
    COLS: COLS,
    THETA: THETA,
    RX: RX,
    RZ: RZ,
    FINDINGS: FINDINGS,
    build: build,
    project: project,
    pointAtColumn: pointAtColumn,
    crownPath: crownPath,
    appearance: appearance,
    drawTooth: drawTooth,
    drawToothXray: drawToothXray,
    drawGums: drawGums
  };
})(window);
