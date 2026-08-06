# Smile Dental Group

A single-page, scroll-driven cinematic site for a dental clinic. The whole page
is one continuous narrative controlled by vertical scroll position — no page
jumps, no traditional sections. Scroll is a timeline scrubber.

Static files, no build step. Open `index.html` over any HTTP server:

```sh
python3 -m http.server 8000     # then http://localhost:8000
```

---

## The timeline

Scroll progress `0 → 1` drives everything. Chapter boundaries live in one place,
[`assets/js/config.js`](assets/js/config.js); the canvas, the copy cross-fades
and the chapter label all read from them.

| Scroll | Chapter | What happens |
| --- | --- | --- |
| 0–12% | Hero | Close-up, lips closed, shallow depth of field. Headline in the top-left third, scroll cue pulsing. |
| 12–25% | Intake | The camera pushes through the lips into the oral cavity. Daylight gives way to the operatory lamp. A full arch of 32 teeth in poor condition — staining, chipped edges, a missing molar, plaque at the gingival margin. |
| 25–40% | Diagnostics | A scan bar sweeps left to right; everything behind it converts to radiography — translucent enamel, roots, canals, jawbone. Findings glow amber and annotate themselves. |
| 40–75% | Treatment | Five instruments march left to right in formation — scaler, handpiece, composite applicator, curing light, polishing cup. Each tooth advances a stage as each head crosses it. A rail tracks arch position and the active instrument. |
| 75–88% | Reveal | The finished arch orbits, a whitening bloom passes over it, and the jaws close into occlusion. |
| 88–100% | Smile | The camera pulls back out of the mouth, the jaw settles into the face, she smiles, the light warms, the CTA resolves. |

Every value is a pure function of scroll progress, so **scrolling up reverses the
treatment exactly** — there is no animation state to get out of sync. The test
suite asserts this by hashing canvas pixels at the same progress reached from
both directions.

## How it is built

```
index.html              markup, copy layers, and a real document for crawlers
assets/css/main.css     palette, type, the pinned stage, the copy cross-fades
assets/js/
  config.js             chapter boundaries, palette, maths helpers
  arch.js               the 32-tooth model: layout, projection, crowns, x-ray
  instruments.js        the five treatment passes
  scenes.js             the face, the oral cavity, the scan bar, the callouts
  renderer.js           maps scroll progress to a frame
  video-track.js        optional pre-rendered timeline (see below)
  main.js               boot, preloader, Lenis + ScrollTrigger, copy layers
assets/vendor/          GSAP 3.15, ScrollTrigger, Lenis 1.3 (vendored, not CDN)
assets/fonts/           Outfit variable (subset, self-hosted)
```

Scroll is smoothed by **Lenis** and turned into a `0..1` value by **GSAP
ScrollTrigger** with `scrub: 1`. A single `requestAnimationFrame` loop paints
from that value. Both libraries are vendored rather than pulled from a CDN, and
if either fails to load the page falls back to a native-scroll driver with its
own easing — it degrades, it does not white-screen.

### Why the arch is 2D

The brief warned against modelling 32 teeth in real time, and it is right — but
the alternative is not necessarily video. Each tooth here is a **2D path drawn
at a projected position and scale**: a small perspective camera gives depth
sorting, foreshortening and the reveal orbit, while the crowns themselves stay
vector, so the surgical detail survives at any resolution and the whole arch
costs ~30 path fills a frame.

Teeth are laid out by **arc length**, not by angle — spacing them evenly in
angle crowds the molars into each other, because out there the arch curve runs
nearly parallel to the view axis.

### Performance notes

Two things dominated the frame budget and are worth knowing before editing:

- **`ctx.filter` costs a save-layer per draw**, roughly 15–20 ms on a software
  rasteriser *regardless of blur radius*. The face had eleven of them. The
  soft-focus half of the face is now rendered once into an offscreen plate
  (keyed on `warmth`, five steps, adjacent steps cross-faded) and blitted; only
  the lips, which are the one thing in the focal plane, are drawn live. Every
  other per-frame blur was replaced with a gradient.
- **Clipping to a path and filling a rect** is much more expensive than filling
  the path directly. Tooth layers fill the crown path.

Result: worst-case frame went from ~530 ms to ~100 ms, and sustained scrub from
7 fps to ~16 fps — measured with **GPU rasterisation disabled entirely**, which
is a floor, not a typical case. (It measured ~26 fps before the bite was opened
wider for the intake and diagnostics chapters; twice the vertical spread means
twice the screen area covered in teeth and gum, and in software that is paid
for in fill rate. The layout was worth it.)

Mobile drops the device-pixel-ratio cap, turns off bloom, widens the bite and
pushes the camera in to suit a portrait frame, and hands the bottom band of the
screen to the copy.

### Accessibility

- The narrative also exists as **a real document** (`.doc` in `index.html`) —
  headings and prose, in the flow, for screen readers and crawlers. The canvas
  is `aria-hidden`.
- `prefers-reduced-motion: reduce` skips the scrubbed run entirely: one held
  frame as a poster, then that document. No pinning, no scrubbing.
- No JavaScript: same document, via `<noscript>`.

---

## Swapping in a pre-rendered track

The canvas renderer is the default and needs no assets. If you render the six
Seedance shots, the scrub plumbing is already there:

1. Stitch the shots into one continuous 20–30 s clip, in narrative order.
2. Encode with a keyframe on every frame or two (`x264 -g 1`) and `-movflags
   +faststart`, otherwise seeking stutters. 1920 wide for desktop, a 720p track
   for mobile.
3. Point `videoTrack` in [`assets/js/config.js`](assets/js/config.js) at them:

```js
var VIDEO_TRACK = {
  desktop: 'assets/video/arch-1920.mp4',
  mobile:  'assets/video/arch-720.mp4',
  duration: 26
};
```

The page then scrubs the clip's playhead against scroll instead of drawing, the
preloader reports real buffering progress, and the canvas steps aside. If the
file is missing or unplayable it logs and falls back to the canvas renderer
rather than failing.

**The visuals here are procedural, not the Seedance footage.** The account
attached to this session is on the free plan with 10 credits, which does not
cover six video generations — so rather than ship a site with placeholder holes
in it, the six shots are drawn in canvas and the video path is left wired up and
documented above.

## Content

The clinic name, address, phone, email and the specific case findings
(caries #14, fracture #19, extraction site #30) are placeholders. The findings
are referenced in three places — `FINDINGS` in `assets/js/arch.js`, the
accessible document in `index.html`, and the callout offsets in
`assets/js/renderer.js` — so change them together.
