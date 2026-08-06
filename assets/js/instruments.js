/* ============================================================
   instruments.js — the five treatment passes.

   Each tool is drawn with its working tip at the local origin and
   its shaft running up and off-screen, so docking it over a tooth
   is just translate+rotate to that tooth's occlusal point.
   ============================================================ */
(function (global) {
  'use strict';

  var U = global.SDG.util;

  var TOOLS = [
    { id: 'scaler',   name: 'Ultrasonic scaler', tint: '#cfe6ef' },
    { id: 'bur',      name: 'High-speed handpiece', tint: '#dfe9ee' },
    { id: 'composite',name: 'Composite applicator', tint: '#e6e2d6' },
    { id: 'cure',     name: 'Curing light', tint: '#7fd8ff' },
    { id: 'polish',   name: 'Polishing cup', tint: '#e4d3dd' }
  ];

  /* Chrome shading: a hard specular band down one side reads as
     polished stainless far better than a flat grey. */
  function chrome(ctx, x0, y0, x1, y1) {
    var g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0.00, '#5c6a74');
    g.addColorStop(0.22, '#c9d6dd');
    g.addColorStop(0.38, '#ffffff');
    g.addColorStop(0.55, '#aebcc5');
    g.addColorStop(0.80, '#78868f');
    g.addColorStop(1.00, '#3d474f');
    return g;
  }

  function shaft(ctx, len, w0, w1) {
    ctx.beginPath();
    ctx.moveTo(-w0, 0);
    ctx.lineTo(-w1, -len);
    ctx.lineTo(w1, -len);
    ctx.lineTo(w0, 0);
    ctx.closePath();
    ctx.fillStyle = chrome(ctx, -w1, 0, w1, 0);
    ctx.fill();
    ctx.strokeStyle = 'rgba(10,20,28,0.5)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  /* Grip knurling — cheap detail that sells the scale of the shot. */
  function knurl(ctx, y, len, w, n) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#2c3840';
    ctx.lineWidth = 0.9;
    for (var i = 0; i < n; i++) {
      var yy = y - (len * i) / n;
      ctx.beginPath();
      ctx.moveTo(-w, yy);
      ctx.lineTo(w, yy);
      ctx.stroke();
    }
    ctx.restore();
  }

  function mist(ctx, seed, beat, spread, count, color) {
    ctx.save();
    ctx.fillStyle = color || 'rgba(214,240,255,0.55)';
    for (var i = 0; i < count; i++) {
      var r1 = U.rand(seed + i * 3.1);
      var r2 = U.rand(seed + i * 7.7);
      var life = (beat * (0.4 + r1 * 0.6) + r2) % 1;
      var a = (r1 - 0.5) * 2.6;
      var d = life * spread;
      ctx.globalAlpha = (1 - life) * 0.65;
      ctx.beginPath();
      ctx.arc(Math.sin(a) * d, -Math.abs(Math.cos(a)) * d * 0.35 + life * 6,
              (0.6 + r2 * 1.8) * (1 - life * 0.5), 0, 6.284);
      ctx.fill();
    }
    ctx.restore();
  }

  /* ── 0 · Ultrasonic scaler ───────────────────────────────── */
  function drawScaler(ctx, s, beat) {
    var buzz = Math.sin(beat * 46) * 0.5 * s;
    ctx.save();
    ctx.translate(buzz, 0);
    shaft(ctx, 158 * s, 5.4 * s, 8 * s);
    knurl(ctx, -56 * s, 54 * s, 7 * s, 8);

    /* curved working tip */
    ctx.beginPath();
    ctx.moveTo(-3.2 * s, 0);
    ctx.quadraticCurveTo(-5 * s, -18 * s, 2 * s, -30 * s);
    ctx.lineTo(5.4 * s, -28 * s);
    ctx.quadraticCurveTo(1 * s, -16 * s, 1.2 * s, 0);
    ctx.closePath();
    ctx.fillStyle = chrome(ctx, -5 * s, 0, 5 * s, 0);
    ctx.fill();
    ctx.restore();

    /* cavitation halo + water */
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 22 * s);
    g.addColorStop(0, 'rgba(180,230,255,0.5)');
    g.addColorStop(1, 'rgba(180,230,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(-24 * s, -24 * s, 48 * s, 48 * s);
    ctx.restore();
    ctx.save();
    ctx.scale(s, s);
    mist(ctx, 11, beat, 26, 10);
    ctx.restore();
  }

  /* ── 1 · High-speed handpiece ────────────────────────────── */
  function drawBur(ctx, s, beat) {
    ctx.save();
    ctx.translate(0, -6 * s);
    /* contra-angle head */
    ctx.beginPath();
    ctx.ellipse(0, -14 * s, 11 * s, 13 * s, 0, 0, 6.284);
    ctx.fillStyle = chrome(ctx, -11 * s, 0, 11 * s, 0);
    ctx.fill();
    ctx.strokeStyle = 'rgba(10,20,28,0.55)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.rotate(0.22);
    ctx.translate(0, -22 * s);
    shaft(ctx, 150 * s, 9 * s, 12 * s);
    knurl(ctx, -62 * s, 60 * s, 11 * s, 9);
    ctx.restore();

    /* spinning bur — motion-blurred into a cone */
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-2.6 * s, -12 * s);
    ctx.lineTo(-4.4 * s, -2 * s);
    ctx.quadraticCurveTo(0, 2.6 * s, 4.4 * s, -2 * s);
    ctx.lineTo(2.6 * s, -12 * s);
    ctx.closePath();
    ctx.fillStyle = '#8fa2ad';
    ctx.fill();
    ctx.globalAlpha = 0.35;
    for (var i = 0; i < 4; i++) {
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 0.7;
      var ph = beat * 60 + i * 1.57;
      ctx.beginPath();
      ctx.moveTo(Math.sin(ph) * 4.2 * s, -11 * s);
      ctx.lineTo(Math.sin(ph + 0.5) * 3.6 * s, -1 * s);
      ctx.stroke();
    }
    ctx.restore();

    /* water spray + sparks */
    ctx.save();
    ctx.scale(s, s);
    mist(ctx, 29, beat, 34, 14);
    mist(ctx, 53, beat * 1.7, 22, 5, 'rgba(255,214,150,0.8)');
    ctx.restore();
  }

  /* ── 2 · Composite applicator ────────────────────────────── */
  function drawComposite(ctx, s, beat) {
    ctx.save();
    ctx.rotate(-0.14);
    ctx.translate(0, -4 * s);
    shaft(ctx, 142 * s, 6 * s, 14 * s);
    /* barrel */
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(-15 * s, -142 * s, 30 * s, 62 * s, 6 * s)
      : ctx.rect(-15 * s, -142 * s, 30 * s, 62 * s);
    ctx.fillStyle = chrome(ctx, -15 * s, 0, 15 * s, 0);
    ctx.fill();
    /* cannula */
    ctx.beginPath();
    ctx.moveTo(-2 * s, 4 * s);
    ctx.lineTo(-3.6 * s, -26 * s);
    ctx.lineTo(3.6 * s, -26 * s);
    ctx.lineTo(2 * s, 4 * s);
    ctx.closePath();
    ctx.fillStyle = '#c9b98f';
    ctx.fill();
    ctx.restore();

    /* extruded bead of composite */
    var bead = 1.6 + Math.sin(beat * 6) * 0.7;
    ctx.save();
    ctx.fillStyle = 'rgba(238,228,204,0.95)';
    ctx.beginPath();
    ctx.ellipse(0, 1.5 * s, bead * 1.7 * s, bead * s, 0, 0, 6.284);
    ctx.fill();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-bead * 0.5 * s, 0.8 * s, bead * 0.5 * s, bead * 0.32 * s, 0, 0, 6.284);
    ctx.fill();
    ctx.restore();
  }

  /* ── 3 · Curing light ────────────────────────────────────── */
  function drawCure(ctx, s, beat) {
    var flick = 0.86 + Math.sin(beat * 9) * 0.14;

    /* the glow goes down first so the wand sits inside it */
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = flick;
    var cone = ctx.createRadialGradient(0, -6 * s, 1, 0, -6 * s, 60 * s);
    cone.addColorStop(0, 'rgba(150,225,255,0.85)');
    cone.addColorStop(0.35, 'rgba(70,160,255,0.35)');
    cone.addColorStop(1, 'rgba(40,110,255,0)');
    ctx.fillStyle = cone;
    ctx.beginPath();
    ctx.moveTo(0, -40 * s);
    ctx.lineTo(-34 * s, 22 * s);
    ctx.lineTo(34 * s, 22 * s);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 26 * s, 0, 6.284);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.rotate(0.16);
    ctx.translate(0, -14 * s);
    shaft(ctx, 150 * s, 8 * s, 13 * s);
    knurl(ctx, -70 * s, 48 * s, 12 * s, 7);
    ctx.restore();

    /* angled emitter tip */
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-8 * s, -26 * s);
    ctx.lineTo(-6 * s, -2 * s);
    ctx.lineTo(6 * s, -2 * s);
    ctx.lineTo(8 * s, -26 * s);
    ctx.closePath();
    ctx.fillStyle = chrome(ctx, -8 * s, 0, 8 * s, 0);
    ctx.fill();
    ctx.fillStyle = 'rgba(190,240,255,' + flick + ')';
    ctx.beginPath();
    ctx.ellipse(0, -2 * s, 6 * s, 2.4 * s, 0, 0, 6.284);
    ctx.fill();
    ctx.restore();
  }

  /* ── 4 · Polishing cup ───────────────────────────────────── */
  function drawPolish(ctx, s, beat) {
    ctx.save();
    ctx.rotate(-0.1);
    ctx.translate(0, -18 * s);
    shaft(ctx, 142 * s, 8 * s, 12 * s);
    ctx.beginPath();
    ctx.ellipse(0, -8 * s, 9 * s, 11 * s, 0, 0, 6.284);
    ctx.fillStyle = chrome(ctx, -9 * s, 0, 9 * s, 0);
    ctx.fill();
    ctx.restore();

    /* rubber cup, wobbling as it spins */
    var wob = Math.sin(beat * 30) * 0.9 * s;
    ctx.save();
    ctx.translate(wob, 0);
    ctx.beginPath();
    ctx.moveTo(-7 * s, -16 * s);
    ctx.quadraticCurveTo(-10 * s, -2 * s, -8 * s, 2 * s);
    ctx.lineTo(8 * s, 2 * s);
    ctx.quadraticCurveTo(10 * s, -2 * s, 7 * s, -16 * s);
    ctx.closePath();
    ctx.fillStyle = '#8d5a68';
    ctx.fill();
    ctx.strokeStyle = 'rgba(20,10,14,0.5)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();

    /* prophy paste flick + polish sparkle */
    ctx.save();
    ctx.scale(s, s);
    mist(ctx, 71, beat, 24, 9, 'rgba(240,220,228,0.7)');
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    var g = ctx.createRadialGradient(0, 2 * s, 0, 0, 2 * s, 20 * s);
    g.addColorStop(0, 'rgba(255,255,255,' + (0.3 + 0.25 * Math.sin(beat * 12)) + ')');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(-22 * s, -20 * s, 44 * s, 44 * s);
    ctx.restore();
  }

  var DRAW = [drawScaler, drawBur, drawComposite, drawCure, drawPolish];

  /* Dock a tool: `enter` 0..1 slides it in from off-screen along
     (ex, ey), `s` is the projected world scale at the tooth, `rot`
     orients the shaft (π points the tip up onto an upper arch). */
  function draw(ctx, index, x, y, s, beat, enter, rot, ex, ey) {
    var d = DRAW[index];
    if (!d) return;
    var e = U.easeOut(U.clamp(enter, 0, 1));
    ctx.save();
    ctx.globalAlpha = e;
    ctx.translate(x + (1 - e) * (ex || -420) * s, y + (1 - e) * (ey || -120) * s);
    ctx.rotate((rot || 0) - (1 - e) * 0.5);
    /* Soft contact shadow so the tip sits on the tooth rather than
       over it. Gradient, not ctx.filter — five tools on screen means
       five save-layers a frame, which costs more than the whole arch. */
    ctx.save();
    ctx.globalAlpha = e * 0.55;
    var sh = ctx.createRadialGradient(0, 4 * s, 1, 0, 4 * s, 20 * s);
    sh.addColorStop(0, 'rgba(2,8,14,0.85)');
    sh.addColorStop(1, 'rgba(2,8,14,0)');
    ctx.fillStyle = sh;
    ctx.beginPath();
    ctx.ellipse(0, 4 * s, 20 * s, 7 * s, 0, 0, 6.284);
    ctx.fill();
    ctx.restore();
    d(ctx, s, beat);
    ctx.restore();
  }

  global.SDG.instruments = { TOOLS: TOOLS, draw: draw };
})(window);
