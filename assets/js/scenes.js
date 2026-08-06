/* ============================================================
   scenes.js — everything that isn't a tooth: the face, the oral
   cavity we fly into, the scan bar, the callouts and the grade.
   ============================================================ */
(function (global) {
  'use strict';

  var U = global.SDG.util;
  var P = global.SDG.config.palette;

  /* ctx.filter is the cheapest depth-of-field we have. Older
     Safari ignores it silently, so probe once and degrade to
     layered translucency if it isn't there. */
  var CAN_FILTER = (function () {
    try {
      var c = document.createElement('canvas').getContext('2d');
      c.filter = 'blur(2px)';
      return c.filter !== 'none';
    } catch (e) { return false; }
  })();

  /* `px` is in *world* units. ctx.filter is specified in canvas
     pixels and ignores the current transform, so multiply by the
     live transform scale — otherwise the depth of field evaporates
     the moment the camera pushes in. Capped, because a 300px blur
     on a full-screen shape is a dropped frame. */
  function blur(ctx, px) {
    if (!CAN_FILTER || px <= 0.05) return;
    var k = 1;
    if (ctx.getTransform) {
      var m = ctx.getTransform();
      k = Math.hypot(m.a, m.b) || 1;
    }
    var r = px * k;
    if (r < 0.3) return;
    ctx.filter = 'blur(' + Math.min(r, 60).toFixed(2) + 'px)';
  }
  function noBlur(ctx) { if (CAN_FILTER) ctx.filter = 'none'; }

  /* ── Studio backdrop ─────────────────────────────────────────
     A dark seamless with one soft pool of light behind the
     subject. A white cyclorama flattens a face this stylised into
     a mannequin; a falloff background gives it a jawline. */
  function drawStudio(ctx, W, H, warmth) {
    ctx.fillStyle = U.mix('#0a121a', '#150f0c', warmth);
    ctx.fillRect(0, 0, W, H);

    var g = ctx.createRadialGradient(W * 0.30, H * 0.30, H * 0.02, W * 0.42, H * 0.42, H * 0.95);
    g.addColorStop(0, U.mix('#33475a', '#5a4436', warmth));
    g.addColorStop(0.45, U.mix('#1a2836', '#2a1f18', warmth));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  /* Face silhouette: chin, jaw, cheekbone, temple, skull. */
  function facePath(sink) {
    sink.moveTo(0, 258);
    sink.bezierCurveTo(-118, 250, -206, 168, -248, 34);
    sink.bezierCurveTo(-278, -60, -286, -196, -268, -300);
    sink.bezierCurveTo(-250, -420, -168, -540, -44, -556);
    sink.lineTo(44, -556);
    sink.bezierCurveTo(168, -540, 250, -420, 268, -300);
    sink.bezierCurveTo(286, -196, 278, -60, 248, 34);
    sink.bezierCurveTo(206, 168, 118, 250, 0, 258);
    sink.closePath();
  }

  /* Hair mass behind the head. Without it the silhouette reads as a
     mannequin no matter how well the skin is lit — it is the single
     cheapest thing that makes the shape a person. */
  function hairPath(sink) {
    sink.moveTo(-352, 560);
    sink.bezierCurveTo(-448, 250, -466, -140, -412, -360);
    sink.bezierCurveTo(-362, -566, -204, -706, 0, -714);
    sink.bezierCurveTo(204, -706, 362, -566, 412, -360);
    sink.bezierCurveTo(466, -140, 448, 250, 352, 560);
    sink.bezierCurveTo(234, 400, 158, 80, 158, -200);
    sink.lineTo(-158, -200);
    sink.bezierCurveTo(-158, 80, -234, 400, -352, 560);
    sink.closePath();
  }

  var LIP_W = 104;

  /* ── Lip geometry ────────────────────────────────────────────
     One parametric mouth: `open` separates the lips, `smile`
     lifts the corners and widens the aperture. */
  function lipShapes(lw, open, smile) {
    var cy = -smile * 0.17 * lw;
    var o = open * lw;

    return {
      corners: cy,
      upperOuter: function (ctx) {
        ctx.beginPath();
        ctx.moveTo(-lw, cy);
        ctx.bezierCurveTo(-lw * 0.62, -lw * (0.30 + smile * 0.06), -lw * 0.26, -lw * 0.36, -lw * 0.07, -lw * 0.20);
        ctx.quadraticCurveTo(0, -lw * 0.14, lw * 0.07, -lw * 0.20);
        ctx.bezierCurveTo(lw * 0.26, -lw * 0.36, lw * 0.62, -lw * (0.30 + smile * 0.06), lw, cy);
        ctx.quadraticCurveTo(lw * 0.5, -lw * 0.02 - o * 0.30, 0, -lw * 0.02 - o * 0.34);
        ctx.quadraticCurveTo(-lw * 0.5, -lw * 0.02 - o * 0.30, -lw, cy);
        ctx.closePath();
      },
      lowerOuter: function (ctx) {
        ctx.beginPath();
        ctx.moveTo(-lw, cy);
        ctx.quadraticCurveTo(-lw * 0.5, lw * 0.03 + o * 0.34, 0, lw * 0.03 + o * 0.38);
        ctx.quadraticCurveTo(lw * 0.5, lw * 0.03 + o * 0.34, lw, cy);
        ctx.bezierCurveTo(lw * 0.66, lw * (0.30 + smile * 0.05), lw * 0.30, lw * 0.44, 0, lw * 0.45);
        ctx.bezierCurveTo(-lw * 0.30, lw * 0.44, -lw * 0.66, lw * (0.30 + smile * 0.05), -lw, cy);
        ctx.closePath();
      },
      aperture: function (ctx) {
        ctx.beginPath();
        ctx.moveTo(-lw, cy);
        ctx.quadraticCurveTo(-lw * 0.5, -lw * 0.02 - o * 0.30, 0, -lw * 0.02 - o * 0.34);
        ctx.quadraticCurveTo(lw * 0.5, -lw * 0.02 - o * 0.30, lw, cy);
        ctx.quadraticCurveTo(lw * 0.5, lw * 0.03 + o * 0.34, 0, lw * 0.03 + o * 0.38);
        ctx.quadraticCurveTo(-lw * 0.5, lw * 0.03 + o * 0.34, -lw, cy);
        ctx.closePath();
      }
    };
  }

  /* ── Soft-focus face plate (cached) ──────────────────────────
     Every out-of-focus layer of the face — hair, neck, skin,
     modelling, rim — costs one `ctx.filter` save-layer per draw, and
     a save-layer is ~15-20ms on a software rasteriser however small
     the radius is. Eleven of them per frame is a slideshow.

     So the soft half of the face is rendered once into an offscreen
     plate in authored units and blitted thereafter. The lips — the
     one thing actually in the focal plane — are still drawn live
     every frame.

     The plate is keyed on `warmth` alone, at five steps, and the two
     neighbouring steps are cross-faded at draw time. Five plates
     covers the whole run with no cache misses mid-scroll, and the
     cross-fade means the grade still slides continuously instead of
     stepping. (Keying on `smile` too multiplied the combinations out
     past the cache and reintroduced the stall it was built to avoid,
     so the smile-dependent folds are drawn live below.)

     The blur radii need no adjustment: blur() scales by the live
     transform, so authoring at K plate-px-per-unit and blitting at
     S screen-px-per-unit gives v*K*(S/K) = v*S, exactly what drawing
     direct would have produced. */
  var PLATE = { x: -560, y: -820, w: 1120, h: 1780 };
  var PLATE_STEPS = 4;                    // 5 levels: 0, ¼, ½, ¾, 1
  var plateCache = [];

  function facePlate(step) {
    if (plateCache[step]) return plateCache[step];

    var K = global.SDG.config.isSmall ? 0.4 : 0.56;
    var c = document.createElement('canvas');
    c.width = Math.round(PLATE.w * K);
    c.height = Math.round(PLATE.h * K);
    var g = c.getContext('2d');
    g.setTransform(K, 0, 0, K, -PLATE.x * K, -PLATE.y * K);
    drawSoftFace(g, step / PLATE_STEPS);

    plateCache[step] = c;
    return c;
  }

  /* Blit the plate for this warmth, cross-fading the two neighbours. */
  function blitFace(ctx, warmth) {
    var f = U.clamp(warmth, 0, 1) * PLATE_STEPS;
    var lo = Math.min(PLATE_STEPS, Math.floor(f));
    var hi = Math.min(PLATE_STEPS, lo + 1);
    var mix = f - lo;

    ctx.drawImage(facePlate(lo), PLATE.x, PLATE.y, PLATE.w, PLATE.h);
    if (hi !== lo && mix > 0.003) {
      ctx.save();
      ctx.globalAlpha = mix;
      ctx.drawImage(facePlate(hi), PLATE.x, PLATE.y, PLATE.w, PLATE.h);
      ctx.restore();
    }
  }

  function drawSoftFace(ctx, warmth) {
    var lw = LIP_W;
    var skinLit = U.mix('#e7bd9e', '#f4cda4', warmth);
    var skinMid = U.mix('#c2937a', '#d5a173', warmth);
    var skinDark = U.mix('#6d4a3e', '#7d5236', warmth);

      /* --- hair, well behind the focal plane --- */
      ctx.save();
      blur(ctx, 16);
      hairPath(ctx);
      var hr = ctx.createLinearGradient(-330, -520, 300, 300);
      hr.addColorStop(0, U.mix('#4a3a34', '#584038', warmth));
      hr.addColorStop(0.3, U.mix('#2a1f1c', '#33231d', warmth));
      hr.addColorStop(1, '#100a09');
      ctx.fillStyle = hr;
      ctx.fill();
      /* one soft sheen where the key light grazes it */
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.3;
      var sheen = ctx.createLinearGradient(-330, -400, -150, -220);
      sheen.addColorStop(0, 'rgba(0,0,0,0)');
      sheen.addColorStop(0.5, U.mix('#8e7a6c', '#a08668', warmth));
      sheen.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sheen;
      ctx.fill();

      /* A few strands so the dark field around the head reads as hair
         rather than as more backdrop — the tight crop puts the
         hairline off-frame, so the mass has to carry it alone. */
      ctx.globalAlpha = 0.16;
      ctx.strokeStyle = U.mix('#b39a86', '#c6a37f', warmth);
      for (var st = 0; st < 7; st++) {
        var sx = -1 + (st % 2) * 2;              // alternate sides
        var f2 = 0.72 + (st / 7) * 0.5;
        ctx.lineWidth = 6 + (st % 3) * 5;
        ctx.beginPath();
        ctx.moveTo(sx * 150 * f2, -600);
        ctx.bezierCurveTo(
          sx * 380 * f2, -430,
          sx * 430 * f2, -110,
          sx * 350 * f2, 380
        );
        ctx.stroke();
      }
      noBlur(ctx);
      ctx.restore();

      /* --- neck, in shadow under the jaw --- */
      ctx.save();
      blur(ctx, 10);
      ctx.beginPath();
      ctx.moveTo(-124, 140);
      ctx.bezierCurveTo(-150, 400, -166, 560, -172, 760);
      ctx.lineTo(172, 760);
      ctx.bezierCurveTo(166, 560, 150, 400, 124, 140);
      ctx.closePath();
      var ng = ctx.createLinearGradient(0, 140, 0, 620);
      ng.addColorStop(0, U.mix('#6a4438', '#78492e', warmth));
      ng.addColorStop(1, U.mix('#a97c66', '#bb8760', warmth));
      ctx.fillStyle = ng;
      ctx.fill();
      noBlur(ctx);
      ctx.restore();

      /* --- head, soft-focus, lit hard from camera-left --- */
      ctx.save();
      blur(ctx, 3);
      ctx.beginPath();
      facePath(ctx);
      var hg = ctx.createLinearGradient(-300, -260, 300, 200);
      hg.addColorStop(0, skinLit);
      hg.addColorStop(0.34, U.mix(skinLit, skinMid, 0.5));
      hg.addColorStop(0.68, skinMid);
      hg.addColorStop(1, skinDark);
      ctx.fillStyle = hg;
      ctx.fill();
      noBlur(ctx);
      ctx.restore();

      ctx.save();
      facePath(ctx);
      ctx.clip();

      /* Key is hard from camera-left, so the whole right half of
         the face has to fall away. Without this ramp the skin
         gradient alone leaves it flat and doll-like. */
      var shadow = ctx.createLinearGradient(-120, 0, 300, 0);
      shadow.addColorStop(0, 'rgba(58,30,22,0)');
      shadow.addColorStop(0.55, U.rgba(U.mix('#4c2a1e', '#57301b', warmth), 0.34));
      shadow.addColorStop(1, U.rgba(U.mix('#2c1610', '#331a0d', warmth), 0.72));
      ctx.fillStyle = shadow;
      ctx.fillRect(-320, -620, 640, 900);

      /* temple shadow cast by the hair, and cheek modelling */
      blur(ctx, 30);
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = U.mix('#6d4738', '#7a4c2e', warmth);
      ctx.beginPath();
      ctx.ellipse(-268, -180, 92, 280, 0.08, 0, 6.284);
      ctx.ellipse(272, -160, 116, 300, -0.08, 0, 6.284);
      ctx.fill();

      /* eye sockets + brow, well outside the focal plane */
      ctx.globalAlpha = 0.44;
      ctx.beginPath();
      ctx.ellipse(-124, -338, 74, 26, -0.12, 0, 6.284);
      ctx.ellipse(124, -338, 74, 26, 0.12, 0, 6.284);
      ctx.fill();

      /* nose: a shadow down the side away from the key, not a blob */
      ctx.globalAlpha = 0.34;
      ctx.beginPath();
      ctx.moveTo(30, -320);
      ctx.bezierCurveTo(52, -240, 62, -170, 50, -112);
      ctx.bezierCurveTo(30, -92, 16, -96, 20, -130);
      ctx.bezierCurveTo(26, -190, 22, -260, 18, -318);
      ctx.closePath();
      ctx.fill();
      noBlur(ctx);

      /* nose tip highlight — soft and wide, not a specular dot */
      blur(ctx, 22);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.13;
      ctx.fillStyle = U.mix('#ffe6d0', '#fff0d4', warmth);
      ctx.beginPath();
      ctx.ellipse(-12, -142, 40, 46, 0, 0, 6.284);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      noBlur(ctx);

      /* ala + nostrils */
      blur(ctx, 7);
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = U.mix('#8a5b49', '#98603c', warmth);
      ctx.beginPath();
      ctx.ellipse(-36, -108, 22, 15, -0.3, 0, 6.284);
      ctx.ellipse(36, -108, 22, 15, 0.3, 0, 6.284);
      ctx.fill();
      ctx.globalAlpha = 0.42;
      ctx.fillStyle = U.mix('#5a3b31', '#66412a', warmth);
      ctx.beginPath();
      ctx.ellipse(-25, -100, 11, 6, -0.35, 0, 6.284);
      ctx.ellipse(25, -100, 11, 6, 0.35, 0, 6.284);
      ctx.fill();
      noBlur(ctx);

      /* philtrum */
      blur(ctx, 9);
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = U.mix('#9b6a56', '#a8714f', warmth);
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-13, -82); ctx.lineTo(-11, -46);
      ctx.moveTo(13, -82); ctx.lineTo(11, -46);
      ctx.stroke();

      /* shadow under the lower lip + a lit chin below it */
      ctx.globalAlpha = 0.3;
      blur(ctx, 20);
      ctx.fillStyle = U.mix('#8a5b49', '#98603c', warmth);
      ctx.beginPath();
      ctx.ellipse(0, 76, 62, 22, 0, 0, 6.284);
      ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = U.mix('#ffe4cc', '#fff0d0', warmth);
      ctx.beginPath();
      ctx.ellipse(-14, 148, 74, 44, 0, 0, 6.284);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      noBlur(ctx);

      ctx.restore();

      ctx.save();
      facePath(ctx);
      ctx.clip();
      blur(ctx, 9);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.5;
      var rim = ctx.createLinearGradient(190, 0, 290, 0);
      rim.addColorStop(0, 'rgba(90,190,200,0)');
      rim.addColorStop(0.75, U.rgba(P.accent, 0.42));
      rim.addColorStop(1, U.mix('#bfeeea', '#ffd7a8', warmth));
      ctx.fillStyle = rim;
      ctx.fillRect(150, -600, 200, 900);
      noBlur(ctx);
      ctx.restore();
  }

  /* ── The face ────────────────────────────────────────────────
     Authored in a 1000-unit square with the mouth at (0,0) of the
     returned transform, so the camera can push straight into it. */
  function drawFace(ctx, W, H, o) {
    var zoom = o.zoom;
    var warmth = o.warmth;
    var smile = o.smile;
    var open = o.open;

    drawStudio(ctx, W, H, warmth);

    ctx.save();
    /* mouth is the pivot: everything scales about it */
    /* The mouth is the pivot and it sits high in frame: a close-up
       framed from the bridge of the nose to below the chin, which
       keeps the eyes out of it. Stylised canvas eyes read as a
       mannequin; a jawline and a mouth read as a person. */
    ctx.translate(W * (o.cx == null ? 0.5 : o.cx), H * (o.cy == null ? 0.44 : o.cy));
    ctx.scale(zoom, zoom);

    var lw = LIP_W;

    /* Past ~3× the head fills well beyond the frame and the upper
       face is off-screen entirely — drop it and flat-fill the skin
       instead of blurring shapes nobody can see. */
    var detail = zoom < 3.4;

    if (detail) {
      /* one blit — or two, cross-fading — instead of eleven
         filtered draws */
      blitFace(ctx, warmth);
    } else {
      /* Past ~3.4x only skin and lips are on screen; a flat fill is
         both cheaper and indistinguishable. */
      ctx.save();
      var hg = ctx.createLinearGradient(-300, -260, 300, 200);
      hg.addColorStop(0, U.mix('#e7bd9e', '#f4cda4', warmth));
      hg.addColorStop(0.68, U.mix('#c2937a', '#d5a173', warmth));
      hg.addColorStop(1, U.mix('#6d4a3e', '#7d5236', warmth));
      ctx.fillStyle = hg;
      ctx.fillRect(-W, -H, W * 2, H * 2);
      ctx.restore();
    }

    /* --- lips: the only thing in the focal plane --- */
    var L = lipShapes(lw, open, smile);
    var lipLit = U.mix('#c97d79', '#d98a7c', warmth);
    var lipDark = U.mix('#8e4a4e', '#a2544d', warmth);

    /* oral interior */
    ctx.save();
    L.aperture(ctx);
    ctx.clip();
    var ig = ctx.createRadialGradient(0, 10, 2, 0, 6, lw * 0.9);
    ig.addColorStop(0, '#120608');
    ig.addColorStop(0.7, '#2a0d10');
    ig.addColorStop(1, '#43151a');
    ctx.fillStyle = ig;
    ctx.fillRect(-lw * 1.2, -lw, lw * 2.4, lw * 2);

    /* the restored arch, once the smile lands. Sized off the
       aperture rather than the lip width — the aperture is what
       clips it, so anything authored independently gets eaten. */
    if (smile > 0.02 && open > 0.02) {
      var reveal = U.clamp(Math.min(smile * 1.4, open * 2.6), 0, 1);
      /* same expressions lipShapes() uses for the inner lip edges */
      var gape = open * lw;
      var apTop = -lw * 0.02 - gape * 0.34;
      var apBot = lw * 0.03 + gape * 0.38;
      var apH = apBot - apTop;

      /* cast shadow from the upper lip, under the teeth so the
         enamel stays white instead of being greyed down by it */
      ctx.globalAlpha = reveal * 0.9;
      var us = ctx.createLinearGradient(0, apTop, 0, apTop + apH * 0.5);
      us.addColorStop(0, 'rgba(20,6,8,0.95)');
      us.addColorStop(1, 'rgba(20,6,8,0)');
      ctx.fillStyle = us;
      ctx.fillRect(-lw, apTop, lw * 2, apH * 0.5);

      /* eight upper teeth on a smile arc: the incisal edges rise
         toward the corners, which is what makes a row of rectangles
         read as an arch instead of a fence */
      var N = 8;
      var widths = [], span = 0, i;
      for (i = 0; i < N; i++) {
        var d = Math.abs(i - (N - 1) / 2) / 3.5;
        widths.push(1 - d * 0.34);                  // narrower toward the corners
        span += widths[i];
      }
      /* place by running width so neighbours share a contact point
         instead of leaving a gap the dark interior shows through */
      var unit = (lw * 1.52) / span;
      var cursor = -lw * 0.76;

      for (i = 0; i < N; i++) {
        var slot = i - (N - 1) / 2;                 // -3.5 .. 3.5
        var away = Math.abs(slot) / 3.5;
        var tw = widths[i] * unit;
        var tx = cursor + tw / 2;
        cursor += tw;
        var ty = apTop + apH * (0.70 - away * away * 0.3);
        var th = apH * (0.86 - away * 0.14);

        ctx.globalAlpha = reveal * (1 - away * 0.22);
        var tg = ctx.createLinearGradient(tx, ty - th, tx, ty);
        tg.addColorStop(0, '#e9f1f3');
        tg.addColorStop(0.5, '#ffffff');
        tg.addColorStop(1, '#dfe9ed');
        ctx.fillStyle = tg;

        var r = tw * 0.2;
        ctx.beginPath();
        ctx.moveTo(tx - tw / 2, ty - th);
        ctx.lineTo(tx + tw / 2, ty - th);
        ctx.lineTo(tx + tw / 2, ty - r);
        ctx.quadraticCurveTo(tx + tw / 2, ty, tx + tw / 2 - r, ty);
        ctx.lineTo(tx - tw / 2 + r, ty);
        ctx.quadraticCurveTo(tx - tw / 2, ty, tx - tw / 2, ty - r);
        ctx.closePath();
        ctx.fill();

        /* contact line between neighbours */
        if (i) {
          ctx.globalAlpha = reveal * 0.18;
          ctx.strokeStyle = '#7d919c';
          ctx.lineWidth = Math.max(0.5, tw * 0.05);
          ctx.beginPath();
          ctx.moveTo(tx - tw / 2, ty - th);
          ctx.lineTo(tx - tw / 2, ty - r);
          ctx.stroke();
        }
      }

      /* lower arch, in shadow */
      ctx.globalAlpha = reveal * 0.5;
      var lg2 = ctx.createLinearGradient(0, apBot - apH * 0.2, 0, apBot);
      lg2.addColorStop(0, '#c3d0d8');
      lg2.addColorStop(1, '#76848e');
      ctx.fillStyle = lg2;
      ctx.beginPath();
      ctx.ellipse(0, apBot - apH * 0.03, lw * 0.5, apH * 0.13, 0, 0, 6.284);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    /* corner shadows keep the aperture from looking pasted on */
    var cg = ctx.createLinearGradient(-lw, 0, lw, 0);
    cg.addColorStop(0, 'rgba(10,3,4,0.9)');
    cg.addColorStop(0.18, 'rgba(10,3,4,0)');
    cg.addColorStop(0.82, 'rgba(10,3,4,0)');
    cg.addColorStop(1, 'rgba(10,3,4,0.9)');
    ctx.fillStyle = cg;
    ctx.fillRect(-lw * 1.2, -lw, lw * 2.4, lw * 2);
    ctx.restore();

    /* lower lip */
    ctx.save();
    L.lowerOuter(ctx);
    var lg = ctx.createLinearGradient(0, -lw * 0.1, 0, lw * 0.48);
    lg.addColorStop(0, lipDark);
    lg.addColorStop(0.35, lipLit);
    lg.addColorStop(1, U.mix(lipDark, '#000000', 0.15));
    ctx.fillStyle = lg;
    ctx.fill();
    ctx.clip();
    ctx.globalAlpha = 0.55;
    var sh = ctx.createRadialGradient(-lw * 0.24, lw * 0.16, 1, -lw * 0.24, lw * 0.16, lw * 0.34);
    sh.addColorStop(0, 'rgba(255,240,236,0.85)');
    sh.addColorStop(1, 'rgba(255,240,236,0)');
    ctx.fillStyle = sh;
    ctx.fillRect(-lw, -lw, lw * 2, lw * 2);
    ctx.restore();

    /* upper lip */
    ctx.save();
    L.upperOuter(ctx);
    var ug = ctx.createLinearGradient(0, -lw * 0.36, 0, lw * 0.02);
    ug.addColorStop(0, U.mix(lipLit, '#000000', 0.1));
    ug.addColorStop(0.55, lipDark);
    ug.addColorStop(1, U.mix(lipDark, '#000000', 0.3));
    ctx.fillStyle = ug;
    ctx.fill();
    ctx.clip();
    ctx.globalAlpha = 0.3;
    var uh = ctx.createRadialGradient(-lw * 0.3, -lw * 0.2, 1, -lw * 0.3, -lw * 0.2, lw * 0.3);
    uh.addColorStop(0, 'rgba(255,235,230,0.9)');
    uh.addColorStop(1, 'rgba(255,235,230,0)');
    ctx.fillStyle = uh;
    ctx.fillRect(-lw, -lw, lw * 2, lw * 2);
    ctx.restore();

    /* vermilion border catch-light */
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = 'rgba(255,226,214,0.8)';
    ctx.lineWidth = 1.6;
    L.upperOuter(ctx); ctx.stroke();
    L.lowerOuter(ctx); ctx.stroke();
    ctx.restore();

    /* Chin crease and nasolabial folds. These deepen with the smile,
       so they can't live in the warmth-keyed plate — and a blurred
       stroke would put a save-layer back in the per-frame path. Three
       widening strokes at falling alpha read the same at this size. */
    if (detail) {
      ctx.save();
      ctx.strokeStyle = U.mix('#96685a', '#a26f52', warmth);
      for (var fp = 0; fp < 3; fp++) {
        ctx.globalAlpha = (0.13 + smile * 0.09) * (1 - fp * 0.3);
        ctx.lineWidth = 8 + fp * 12;
        ctx.beginPath();
        ctx.moveTo(-lw * 1.05, -lw * 0.55 - smile * 12);
        ctx.quadraticCurveTo(-lw * 1.35, lw * 0.1, -lw * 1.12, lw * 0.52);
        ctx.moveTo(lw * 1.05, -lw * 0.55 - smile * 12);
        ctx.quadraticCurveTo(lw * 1.35, lw * 0.1, lw * 1.12, lw * 0.52);
        ctx.moveTo(-lw * 0.5, lw * 0.86);
        ctx.quadraticCurveTo(0, lw * 0.98, lw * 0.5, lw * 0.86);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore();

    /* --- key light spill from camera-left --- */
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.1;
    var kl = ctx.createRadialGradient(W * 0.14, H * 0.18, 1, W * 0.14, H * 0.18, H * 1.1);
    kl.addColorStop(0, U.mix('#cfe4f2', '#ffd9a8', warmth));
    kl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = kl;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  /* ── Oral cavity backdrop for the arch chapters ──────────── */
  function drawCavity(ctx, W, H, clinical) {
    var g = ctx.createRadialGradient(W * 0.5, H * 0.52, H * 0.05, W * 0.5, H * 0.5, H * 1.05);
    g.addColorStop(0, U.mix('#3a1216', '#0e1c26', clinical));
    g.addColorStop(0.45, U.mix('#22090d', '#081420', clinical));
    g.addColorStop(1, U.mix('#0a0305', '#04090f', clinical));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* cheek walls */
    ctx.save();
    ctx.globalAlpha = 0.5 * (1 - clinical * 0.55);
    var l = ctx.createLinearGradient(0, 0, W * 0.3, 0);
    l.addColorStop(0, 'rgba(120,42,48,0.9)');
    l.addColorStop(1, 'rgba(120,42,48,0)');
    ctx.fillStyle = l;
    ctx.fillRect(0, 0, W * 0.3, H);
    var r = ctx.createLinearGradient(W, 0, W * 0.7, 0);
    r.addColorStop(0, 'rgba(120,42,48,0.9)');
    r.addColorStop(1, 'rgba(120,42,48,0)');
    ctx.fillStyle = r;
    ctx.fillRect(W * 0.7, 0, W * 0.3, H);
    ctx.restore();

    /* Tongue, way out of focus at the bottom. A radial gradient
       rather than a blurred ellipse: this one draws every frame of
       the arch section, and each ctx.filter draw is a save-layer. */
    ctx.save();
    ctx.globalAlpha = 0.55 * (1 - clinical * 0.7);
    var tg = ctx.createRadialGradient(W * 0.5, H * 1.02, 1, W * 0.5, H * 1.02, W * 0.4);
    tg.addColorStop(0, '#8e3b45');
    tg.addColorStop(0.55, 'rgba(142,59,69,0.7)');
    tg.addColorStop(1, 'rgba(142,59,69,0)');
    ctx.fillStyle = tg;
    ctx.beginPath();
    ctx.ellipse(W * 0.5, H * 1.02, W * 0.46, H * 0.3, 0, 0, 6.284);
    ctx.fill();
    ctx.restore();

    /* clinical overhead light once the operatory lamp comes on */
    if (clinical > 0.02) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = clinical * 0.5;
      var cl = ctx.createRadialGradient(W * 0.5, H * 0.18, 1, W * 0.5, H * 0.45, H * 0.95);
      cl.addColorStop(0, 'rgba(214,238,250,0.7)');
      cl.addColorStop(1, 'rgba(214,238,250,0)');
      ctx.fillStyle = cl;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }

  /* ── Radiographic scan bar ───────────────────────────────── */
  function drawScanBar(ctx, W, H, x, intensity) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = intensity;

    var trail = ctx.createLinearGradient(x - W * 0.22, 0, x, 0);
    trail.addColorStop(0, 'rgba(88,190,240,0)');
    trail.addColorStop(1, 'rgba(88,190,240,0.24)');
    ctx.fillStyle = trail;
    ctx.fillRect(x - W * 0.22, 0, W * 0.22, H);

    var beam = ctx.createLinearGradient(x - 26, 0, x + 26, 0);
    beam.addColorStop(0, 'rgba(120,220,255,0)');
    beam.addColorStop(0.45, 'rgba(190,245,255,0.9)');
    beam.addColorStop(0.5, 'rgba(255,255,255,1)');
    beam.addColorStop(0.55, 'rgba(190,245,255,0.9)');
    beam.addColorStop(1, 'rgba(120,220,255,0)');
    ctx.fillStyle = beam;
    ctx.fillRect(x - 26, 0, 52, H);
    ctx.restore();
  }

  /* ── Clinical callout ────────────────────────────────────────
     Findings are annotated the way a radiograph is: a dot on the
     tooth, an elbowed leader, and the labels stacked in a reserved
     gutter. Anchoring labels to the teeth themselves means they
     collide with each other and with the copy as the arch moves. */
  function drawCallout(ctx, x, y, label, code, alpha, gutterX, rowY, side, small) {
    if (alpha <= 0.01) return;

    var elbowX = gutterX - side * 26;
    var f1 = small ? 9 : 11;
    var f2 = small ? 13 : 15;

    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.strokeStyle = 'rgba(255,181,74,0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(elbowX, rowY);
    ctx.lineTo(gutterX, rowY);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,181,74,1)';
    ctx.beginPath();
    ctx.arc(x, y, 2.6, 0, 6.284);
    ctx.fill();
    /* target ring, so the dot reads as a measurement not a speck */
    ctx.globalAlpha = alpha * 0.5;
    ctx.strokeStyle = 'rgba(255,181,74,0.9)';
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, 6.284);
    ctx.stroke();
    ctx.globalAlpha = alpha;

    ctx.textAlign = side > 0 ? 'left' : 'right';
    var tx = gutterX + side * 10;

    if (ctx.letterSpacing !== undefined) ctx.letterSpacing = small ? '1.4px' : '2px';
    ctx.textBaseline = 'bottom';
    ctx.font = '300 ' + f1 + 'px ' + FONT;
    ctx.fillStyle = 'rgba(246,250,252,0.6)';
    ctx.fillText(label.toUpperCase(), tx, rowY - 4);

    ctx.textBaseline = 'top';
    ctx.font = '500 ' + f2 + 'px ' + FONT;
    ctx.fillStyle = 'rgba(255,181,74,0.95)';
    ctx.fillText(code, tx, rowY + 2);
    if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';

    ctx.restore();
  }

  var FONT = "'Outfit', system-ui, sans-serif";

  /* ── Whitening bloom sweep ───────────────────────────────── */
  function drawBloom(ctx, W, H, t) {
    if (t <= 0 || t >= 1) return;
    var x = U.lerp(-W * 0.45, W * 1.45, U.easeInOut(t));
    var fade = Math.sin(t * Math.PI);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = fade * 0.65;
    var g = ctx.createLinearGradient(x - W * 0.3, H, x + W * 0.3, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.45, 'rgba(226,248,255,0.55)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.55, 'rgba(226,248,255,0.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  global.SDG.scenes = {
    CAN_FILTER: CAN_FILTER,
    blur: blur,
    noBlur: noBlur,
    FONT: FONT,
    drawStudio: drawStudio,
    drawFace: drawFace,
    drawCavity: drawCavity,
    drawScanBar: drawScanBar,
    drawCallout: drawCallout,
    drawBloom: drawBloom
  };
})(window);
