/* ============================================================
   video-track.js — optional pre-rendered timeline.

   The canvas renderer is the default. If you render the six
   Seedance shots, stitch them into one continuous clip and set
   `videoTrack` in config.js: this module then scrubs that clip's
   playhead against scroll instead, and the canvas steps aside.

   Notes that matter for a scrubbable file:
   · encode with a keyframe every 1–2 frames (x264 -g 1) or seeking
     will stutter; the file gets big, which is fine, it's one asset
   · 24–30fps, 20–30s, 1920w desktop / 720p mobile
   · MP4/H.264 + faststart, so the moov atom is at the front
   ============================================================ */
(function (global) {
  'use strict';

  var U = global.SDG.util;
  var CFG = global.SDG.config;

  function VideoTrack(el) {
    this.el = el;
    this.ready = false;
    this.duration = 0;
    this.target = 0;
    this.current = 0;
    this.seeking = false;
  }

  VideoTrack.prototype.load = function () {
    var self = this;
    var src = CFG.videoTrack[CFG.isSmall ? 'mobile' : 'desktop'] ||
              CFG.videoTrack.desktop;

    return new Promise(function (resolve, reject) {
      var v = self.el;
      v.src = src;
      v.muted = true;
      v.playsInline = true;
      v.preload = 'auto';

      var done = function () {
        self.duration = CFG.videoTrack.duration || v.duration || 0;
        self.ready = true;
        resolve(self);
      };
      v.addEventListener('loadedmetadata', function () {
        /* Nudge the decoder so the first frame is painted, not black. */
        try { v.currentTime = 0.001; } catch (e) {}
      }, { once: true });
      v.addEventListener('canplaythrough', done, { once: true });
      v.addEventListener('error', function () {
        reject(new Error('video track failed to load: ' + src));
      }, { once: true });
      /* canplaythrough can be withheld on metered connections. */
      setTimeout(function () { if (!self.ready) done(); }, 12000);
    });
  };

  VideoTrack.prototype.progress = function () {
    if (!this.el.buffered || !this.el.buffered.length || !this.el.duration) return 0;
    return U.clamp(this.el.buffered.end(this.el.buffered.length - 1) / this.el.duration, 0, 1);
  };

  /* Seek is async and can be dropped; only issue a new one when the
     previous has landed, and let the target keep moving meanwhile. */
  VideoTrack.prototype.scrub = function (p) {
    if (!this.ready || !this.duration) return;
    this.target = U.clamp(p, 0, 1) * (this.duration - 0.05);
    if (this.seeking) return;
    if (Math.abs(this.target - this.current) < 1 / 120) return;

    var self = this;
    this.seeking = true;
    this.current = this.target;

    var v = this.el;
    var settle = function () {
      v.removeEventListener('seeked', settle);
      self.seeking = false;
    };
    v.addEventListener('seeked', settle);
    try {
      if (v.fastSeek) v.fastSeek(this.current);
      else v.currentTime = this.current;
    } catch (e) {
      this.seeking = false;
    }
  };

  global.SDG.VideoTrack = VideoTrack;
})(window);
