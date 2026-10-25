# Finely Crafted — public website investigation

Investigation date: 26 October 2026, Asia/Calcutta. Target: https://www.finely-crafted.com/area/court

**Status: investigation only. No reconstruction, application scaffold, or deployment has been created.**

The experience is a Vue application surrounding a custom WebGL renderer. It is a navigable, animated studio with three areas and a shared camera path, rather than a collection of ordinary scrolling pages. The court combines a dark basketball court, a continuously rotating sneaker, baked illumination, a reflective floor, and HTML/SVG navigation and collection controls.

REA was not available as a named tool or installed skill in this session. This investigation used the available browser DOM/accessibility inspection, screenshots, public-resource inventory, console messages, normal interactions, and static analysis of the JavaScript/CSS publicly loaded by the page. No authentication, access-control bypass, private endpoints, or source-map probing was used. Downloaded code was inspected as text; embedded scene JSON was parsed as data, not executed locally.

## 1. Evidence and confidence

The labels below distinguish different kinds of evidence:

- **Observed:** reproduced through the public interface or measured in its DOM.
- **Code-confirmed:** explicitly present in the downloaded production bundles; this does not prove every branch executed in the current browser.
- **Inference:** a likely explanation, with its basis identified.
- **Unverified:** requires another capture or measurement.

| Finding | Evidence | Confidence |
|---|---|---|
| Vue 2.6.11 | Vue runtime version and compiled `.vue` component paths | Code-confirmed |
| Vue Router 3.4.3 and Vuex 3.5.1 | Router/store exports in `vendors.js`; app creates router/store and mounts Vue | Code-confirmed |
| Webpack chunk loading | `webpackJsonp`, runtime loader, numbered chunks | Code-confirmed; exact Webpack version not established |
| GSAP 3.6.0 | Runtime version plus explicit application timeline calls | Code-confirmed |
| SplitText, custom easing, Draggable/Inertia-related code | Character splitting, hover timelines, inertia registration and vendor code | Code-confirmed; usage differs by feature |
| ScrollTrigger and scrollbar code | Present in vendors | Bundled; not evidence that ScrollTrigger drives the court camera |
| Direct WebGL rendering | Context creation, buffers, shader compilation, render targets and draw calls in app bundle | Code-confirmed |
| WebGL2 with WebGL1 fallback | Renderer construction tries the WebGL2 class, then the WebGL1 class | Code-confirmed; actual selected context not queried |
| Three.js / React Three Fiber | No identifying renderer/classes or package evidence found in examined bundles | Not established; do not describe the original as Three.js |
| Howler audio integration | Howler implementation and loader tasks, named sound channels and loaded OGG files | Code-confirmed; audio output not audited by listening |
| Modernizr 3.11.3 | Version in app bundle | Code-confirmed |
| Unity-origin export | `instanceId`, `animatorId`, `lightmapScaleOffset`, transform IDs and MetallicSmoothness texture naming | Inference only; this is not evidence of a Unity WebGL runtime |

Primary public sources: [court page](https://www.finely-crafted.com/area/court), [app.js](https://www.finely-crafted.com/version/1618820191854/js/app.js), [vendors.js](https://www.finely-crafted.com/version/1618820191854/js/vendors.js), [scene chunk 2](https://www.finely-crafted.com/version/1618820191854/js/2.js), [scene chunk 3](https://www.finely-crafted.com/version/1618820191854/js/3.js), and [app.css](https://www.finely-crafted.com/version/1618820191854/css/app.css).

## 2. Page and component hierarchy

The mounted DOM contains an absolutely positioned full-viewport canvas and sibling interface layers. After the entry screen closes, the direct children of `main` include:

```text
main
├── CanvasContainer → background span + canvas#canvas
├── header → sound, bee/collection controls, mini-map
├── MainNavigation
├── HotspotOverview
├── AreaVideoPlayer
├── route content → AreaPage / hotspot detail content
├── GenericLoader
└── CustomCursor
```

The app bundle additionally identifies `SitePreloader`, `CollabLogos`, `CollabInfo`, `ExclusiveContentOverlay`, `AgeGatePage`, `DateOfBirthInput`, `AreaHotspot`, `ScrollHint`, `ExclusiveCourtContent`, and reusable button components. These are actual compiled component names, not invented reconstruction names. Some are conditionally mounted or hidden.

At 1440 × 900, `document.documentElement.scrollHeight` was 900 and body overflow was `hidden`. The canvas CSS dimensions were 1440 × 900, with a backing buffer of 1800 × 1125: 1.25 pixels per CSS pixel in this session. That ratio is not a universal quality cap; the source initializes it from device pixel ratio.

Public navigation exposes `/area/lounge`, `/area/school`, and `/area/court`. Selecting Shoe School updated the URL and rendered the corresponding room without returning to the entry screen. Opening its Design Board hotspot eventually navigated to `/area/school/view/moodboard`; Back returned to `/area/school`.

The initial request to the court presented the branded preloader/entry screen and cookie notice. It did not present an age form during this session. Age-gate components in the bundle do not justify claiming that gate is always shown or absent.

## 3. Visual composition

The court uses a near-black industrial interior, gray concrete/painted surfaces, cream court lines and lettering, and warm light patches across the floor. A large cream-and-honey sneaker floats above the court. Ceiling beams, the basketball hoop, wall lettering, the court arcs, and the shoe silhouette provide strong perspective landmarks.

At desktop size the interface places sound near the upper-left corner, the bee and eight collection cells near the top center, the mini-map at lower left, and the court collection prompt and directional graphic along the lower edge. The map expands to three oversized staggered typographic links over a darkened scene, with Back at upper right and legal links near the bottom.

Four font families are confirmed by CSS and resource inventory:

| Family | Role to verify during reconstruction |
|---|---|
| Jasper Standard | Condensed decorative display typography |
| Motlow | Branded uppercase labels and prompts |
| Knockout | Condensed utility/display labels |
| Akzidenz Grotesk | Supporting body and utility text |

These role descriptions summarize the visual/style evidence; individual selectors should be matched against computed styles in the final comparison. Cream `#eae8db`, near-black `#000104`, and yellow `#ffcc06` occur in interface SVGs. The rendered scene contains many additional lighting-dependent colors.

## 4. Rendering pipeline and scene data

The app defines its own renderer, camera, transforms, matrix/quaternion math, materials, render targets, input listeners and shader loader. Direct WebGL calls establish real-time 3D rendering independently of the visual appearance.

The scene is loaded as JSON embedded inside JavaScript chunks:

| Public file | Saved decoded file size | Contents |
|---|---:|---|
| `js/1.js` | 15,222 bytes | Translation/content data |
| `js/2.js` | 9,605,835 bytes | Building scene: 370 transforms, 73 materials, 251 object records, 3 animation records |
| `js/3.js` | 4,587,203 bytes | 176 additional object records |
| `js/app.js` | 618,020 bytes | App, renderer, shaders and interaction logic |
| `js/vendors.js` | 837,502 bytes | Frameworks and supporting libraries |
| `css/app.css` | 37,624 bytes | Main styling and font definitions |
| `css/vendors.css` | 3,302 bytes | Vendor styles |

Object counts are serialized records, not measured visible draw calls or unique mesh counts. The two geometry chunks total 14,193,038 bytes before transfer compression. These are local decoded file sizes, not network transfer sizes.

Scene data identifies a `Building` root, `Main Camera`, `Models`, architectural geometry, `BasketballCourt`, projection surfaces, lights, `Hotspots`, and `HotspotCameraPositions`. Court-related transforms include the floor/walls/ceiling, hoop/court markings and sneaker. Shared geometry also covers the bar and school. Objects contain indices, vertex attributes, material references, transform IDs and lightmap offsets; common attributes include position, normal, UV0, UV1 and tangent. There was no need to assume GLB/GLTF assets: the observed geometry is embedded JSON.

The confirmed frame pipeline is:

1. Check resize, pause state, forced updates and active transitions.
2. Update camera/door animation tracks from normalized traversal progress.
3. Update camera smoothing, lighting/projection tweens and model animation.
4. Rotate the court shoe using elapsed time and sinusoidal tilt.
5. Project hotspot locations for the HTML UI and perform ray intersection work for interactive projection content.
6. On enabled desktop paths, render a reflected scene to a reduced-size target and generate blurred mip levels.
7. Draw the main scene into the bloom target: base geometry, visible dynamic/static solids, transparent objects, projection surfaces and video-wall still image.
8. Resolve the target where needed and composite bloom to the canvas.

Custom GLSL families explicitly include floor, hotspot, lightmap packing, merged lit/unlit geometry, model/PBR, projection and transparent-video shaders. Lightmap inputs include `lights_on.jpg` and `lights_projection.jpg`. The app packs lighting into a target and distributes it to materials. The floor reflection is a separate mirrored-view pass; it should not be described as confirmed screen-space reflection.

Bloom is enabled in the examined app configuration, with threshold 1, strength 0.75 and pass boost 0.25. Reflection is disabled for the source's detected mobile-device path. These are code settings, not performance measurements.

## 5. Animation and input behavior

| Trigger | Behavior | Evidence |
|---|---|---|
| Initial load | Branded loader, split title characters, progress indicator, Enter button | Observed + code |
| Enter | Entry layer disappears; scene and exploration UI become available | Observed |
| First scroll | Exploration instruction is hidden | Observed + code |
| Continued wheel/keyboard input | Smoothed virtual position drives a chapter-based camera timeline | Code-confirmed; screenshot changes observed, exact wheel-to-distance calibration not measured |
| Pointer movement/drag | Camera hover and user rotation controllers, with automatic return toward authored orientation | Code-confirmed; isolated hover amplitudes not measured |
| Map open | Three typographic links animate into view over darkened scene | Observed + code |
| Menu link hover | Character flip/translation between duplicated label layers, UI sound request | Code-confirmed; hover timing not instrumented live |
| Area selection | Route changes and camera chapter transition | Observed + code |
| Hotspot activation | Camera focus/detail flow and nested detail route | Observed on Design Board + code |
| Design Board drag | Collage translates under the pointer | Observed before/after screenshots |
| Hotspot return | Area route returns and a collected Design Board item appears in header | Observed; reload persistence not tested |

The camera animation clip has an authored duration of about 18.0167 seconds, with position/rotation tracks. Door clips are approximately 18 and 18.0333 seconds. **These are authored timeline lengths, not the wall-clock time required to travel through the site.** The app samples each clip at `duration × normalizedProgress`.

Traversal maps each chapter to one sixth of the full animation, offsets school by 1/6 and court by 2/6, and mirrors progress for reverse travel. The virtual scroller uses a forward/backward loop, with per-chapter boundaries updating the route. Its range is based on `min(viewportHeight, 800) × chapterCount × factor`, where factor is 8 normally and 3 for Firefox. Source smoothing includes a lerp factor of 0.15 and separate pointer/touch scroll multipliers. Overlay/menu/hotspot states disable area scrolling.

Arrow keys and Page Up/Page Down/Space are handled explicitly. The exact direction conventions follow the source's virtual delta mapping and need a repeatable keyboard test before implementation. No WASD/free-roam behavior was established.

Camera construction uses an approximately 60-degree FOV, near 0.05 and far 50. Its controller uses a 0.1 pivot distance and 1.4 vertical pivot adjustment. User rotation can hold priority with a 20-second cooldown; wheel input resets the cooldown. Chapter-jump code rolls around the camera Z pivot and switches chapter at the midpoint. Default jump duration is 1 second, subject to caller overrides.

Menu timing is explicit: 0.8-second entry motion, 0.2-second stagger between links, vertical displacement from 25%, and label rotation from 10 degrees. Exit uses 0.8-second motion, 0.1-second stagger, -25% displacement and -10-degree rotation. Hover uses a 0.25em horizontal shift over 0.5 seconds, plus 0.4-second character flips with a 0.2-second aggregate stagger. Named custom easing curves are present.

The shoe updates continuously: yaw advances at 0.23 radians per second, with sinusoidal X/Z tilt. Repeated screenshots will therefore differ even when camera position and viewport match.

## 6. Public resources and loading sequence

The versioned root is `/version/1618820191854/`. The browser inventory captured script, stylesheet, font, image, video and other resource references. It is saved in `evidence/asset-inventory-entry.json` and `evidence/asset-inventory-hotspot.json`. Third-party query strings were removed from saved inventories to avoid retaining unnecessary tracking identifiers.

Observed dependencies include:

- Four WOFF2 font files, with WOFF fallbacks declared in CSS.
- `static/image/shoe.png`, `hotspot-single.webp`, and later `hotspot-hover.webp`.
- `static/webgl/floor.webp`, `videowall.webp`, lighting images, shoe A/B albedo, normal, AO and MetallicSmoothness maps.
- Additional leather, design-board, bee, bottle, safe and other shared-room material maps.
- `static/video/intro-small.mp4` at initial narrow viewport; `school-large.mp4` appeared after the school interaction. Initial device/layout decisions may persist after resizing.
- Ten named OGG files observed for music, room ambience, general click/hover, gold-diamond/bee hover and transitions.
- On Design Board activation, `js/0.js`, `css/0.css` and a set of moodboard JPG/PNG resources appeared, confirming deferred detail-content loading.
- OneTrust consent scripts/configuration and Google, Facebook and Scorecard tracking resources.

The supported dependency sequence is document/styles/main runtime → locale and scene chunks → scene textures/media/audio → ready/Enter state → area interaction → lazy detail chunk and content images. Independent resources may overlap in flight. **A timestamped network waterfall, status/header capture, HAR and compressed-byte measurement were not available from the browser inspection interface.** Resource inventory order is not a proven completion order. The read-only page evaluator did not expose the Performance API, so no load-time or FPS values are claimed.

## 7. Responsive behavior and performance

Captured CSS viewport sizes were 714 × 615, 1440 × 900 and 390 × 844. The portrait view retains the canvas and top collection controls, wraps the bottom court prompt, and shrinks/stacks the map typography. In the sampled portrait camera state, the shoe is largely cropped off the left edge. That is a captured composition, not proof of its position throughout all portrait travel states.

CSS contains breakpoint rules at 480, 768, 800, 960, 1024, 1920 and 3840 pixels, plus a 768-wide/720-high condition and hover-capability rules. Narrow viewport testing did not change the browser user agent or emulate touch hardware. The mobile renderer path—smaller lightmaps, different controls, disabled reflections—was therefore examined in code but not validated on an actual mobile device.

Confirmed optimizations include WebP selection, lazy detail chunks, cached mesh data keyed by instance ID, separate static/dynamic rendering paths, bounding-box frustum checks for solid geometry, cached GL state/VAOs, reduced-resolution reflection with blur mips, mobile reflection suppression, and pause-aware rendering. Some tweens use a fixed 1/60 update increment while shoe motion uses elapsed time; transition timing under dropped frames deserves measurement.

Potential costs are the large decoded geometry payload, parse/allocation work, lightmap memory, multiple rendering passes, full device-pixel-ratio buffers and third-party scripts. These are risk factors, not measured defects. The observed console reported GSAP warnings about `autoAlpha` and `clearProps`; visual navigation still worked. Preserve these in the investigation findings, but do not infer that the full animation system is broken.

## 8. Independent reconstruction architecture — recommendation only

The requested Next.js/TypeScript stack is suitable, with a client-only WebGL scene under persistent React interface layers. Since 3D is confirmed, React Three Fiber/Three.js is a reasonable independent implementation choice even though the original uses a custom renderer.

Recommended ownership boundaries:

```text
Next.js route shell
├── Experience state: area, progress, direction, overlays, collection, audio
├── Persistent scene canvas
│   ├── Authored building geometry and lightmaps
│   ├── Camera rig + traversal tracks + hotspot focus
│   ├── Court shoe animation
│   ├── Floor reflection and bloom
│   └── Hotspot projection / hit testing
├── React HUD and navigation
├── GSAP DOM transition controllers
└── Lazy detail views and media
```

Use a shared state machine to prevent scroll, focus transitions and overlays from fighting over the camera. Preserve the distinction between elapsed-time animation, progress-sampled animation and triggered UI timelines. GSAP fits the DOM transitions; frame updates can own camera interpolation and shader uniforms. Custom materials are likely needed for lightmap blending, floor response and projection fidelity. A generic physically lit room with default materials will not match this reference.

Asset work should precede detailed animation tuning: independently model the architecture/shoe, reproduce material scale and baked-light composition, then tune camera poses and UI. The inspected proprietary geometry, textures, fonts, logos, sound and video are **reference evidence, not an asset license**. No reuse rights were established. Reconstruct with original assets or licenses explicitly permitting the intended use; maintain an asset provenance manifest. Keep copied production bundles out of the implementation and distributable output.

## 9. Verification baseline and remaining work

Screenshots are saved under `evidence/`:

| File | State |
|---|---|
| `01-court-entry-714x615.png` | Court after entry at original browser size |
| `02-court-desktop-1440x900.png` | Desktop court baseline with exploration hint |
| `03-after-scroll-1440x900.png` | First-scroll state, hint removed |
| `04-map-1440x900.png` | Desktop map open |
| `05-court-travel-1440x900.png` | Court after additional scroll input |
| `06-drag-view-1440x900.png` | Court after drag probe |
| `07-portrait-390x844.png` | Portrait court |
| `08-portrait-map-390x844.png` | Portrait map |
| `09-school-390x844.png` | School after route selection |
| `10-hotspot-state-390x844.png` | Design Board detail |
| `11-collage-after-drag-390x844.png` | Design Board after drag |

The initial cookie/entry screen was observed in the conversation capture but not saved as a standalone evidence image. File 01 is the post-entry court, not the loader.

For later matching comparisons, use identical CSS viewport, DPR, route, progress, camera direction, pointer location, overlay state and collection state. Fix elapsed time for the shoe and wait for transitions to settle. Compare court arcs/hoop/walls first, then shoe silhouette/materials, lighting/reflections, typography and overlay placement. Use screenshots plus timed interaction recordings; a single still image cannot validate camera travel or easing.

Suggested acceptance targets—not measurements of the original—are 60 fps on the target desktop, a separately profiled mobile budget, no input-blocking long tasks during ordinary travel, and no overlapping camera transitions. Record frame-time distributions, decoded texture memory, geometry memory, draw calls and cold/warm load times on named hardware.

Outstanding evidence gaps:

- Exact wheel units to camera travel, isolated hover motion and drag cooldown behavior.
- Actual mobile/touch path and reduced-motion behavior.
- Complete hotspot set, all eight collection actions, persistence and exclusive unlock.
- Entry/age-gate variants and full audio/video playback behavior.
- Full network timings, GPU/frame-time profile and device-specific context selection.
- All intermediate transition frames and exact render color-management settings.

No reconstruction exists yet, so original-versus-reconstruction visual differences, missing implementation behavior and comparative performance are **not yet testable**. The screenshot set and source findings establish the baseline for that later phase.

## 10. Evidence files

`public-source-manifest.json` records byte lengths and SHA-256 hashes of the seven downloaded public JS/CSS files. `scene-summary.json` records scene counts and camera/hotspot transform identifiers. `js-2.js-structure.json` retains parsed transform/material/animation evidence. `code-excerpts.json` and `render-loop-excerpt.txt` retain focused rendering/controller excerpts. Asset inventories record observed resource URLs and discovery types. All are investigation artifacts, not implementation dependencies.
