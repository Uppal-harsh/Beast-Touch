# Three main agents — BeastTouch experience

## Purpose and current state

Use the public Finely Crafted investigation as inspiration for a distinct BeastTouch experience. The current `beasttouch/` Next.js app already includes a simplified React Three Fiber court, a 2D sneaker image, three thematic areas, menus and dialogs. Its current behavior does not reproduce the reference's continuous shared camera path, floating 3D shoe, projected hotspots, or lighting pipeline. The three agents below divide future work without treating public production assets as implementation inputs.

## Agent 1 — Scene and rendering

**Owns:** `beasttouch/components/CourtScene.tsx` and any new scene, camera, material, lighting, or 3D asset modules. Independently author the court architecture, hoop and markings, sneaker mesh, materials, light design, camera poses and travel, floor reflection, bloom, projected hotspot anchors, and quality settings. Keep the canvas mounted while areas change.

**Receives from Agent 2:** area, normalized travel progress (0–1), direction, transition phase, focus target, pointer intent, and reduced-motion setting. **Emits:** projected hotspot positions and visibility, plus camera transition ready/completed events. Scene code does not own routing, wheel, touch, or global keyboard listeners.

**Sequence:** establish original static court compositions at 1440 × 900 and 390 × 844; implement progress-sampled camera travel and elapsed-time sneaker motion; then add and profile reflection, bloom, and adaptive rendering. Dispose GPU resources on teardown. Avoid allocating Three.js objects during React renders.

## Agent 2 — Experience and interaction

**Owns:** `beasttouch/components/Experience.tsx` and future experience-state, navigation, HTML/SVG interface, dialog, and motion modules. Define one typed state model for area, progress, direction, transition phase, overlay/detail, explored items, audio, and reduced motion. Arbitrate wheel, touch, drag, keyboard, map links, and hotspot selection through one transition controller. Synchronize routes if area URLs are introduced. Own GSAP DOM timelines, focus management, responsive UI, and accessible control labels.

**Contract with Agent 1:** send scene inputs; consume projected hotspot coordinates and completion events; pause or constrain travel while a menu, dialog, or focused hotspot is active. Keep a single owner for each input and transition. Coordinate any new hotspot data shape before either side changes it.

**Known gaps to resolve when this role begins implementation:** current area navigation jumps between three camera offsets; hotspots sit on a DOM shoe image; sound is a generated drone; saved bag data lacks shape validation; editing a saved pair does not restore its size and color; reduced motion does not stop camera easing. The `.area-meta` GSAP selector currently matches no element.

## Agent 3 — Assets and validation

**Owns:** an asset provenance manifest, comparison captures, interaction verification, device and performance logs, and reproducible setup documentation. Record each implementation asset's creator/source, license or permission, edits, and permitted use. Keep evidence downloads in `investigation/` and out of build output.

Use the baseline screenshots at 714 × 615, 1440 × 900, and 390 × 844. Fix viewport, DPR, route/area, travel progress, camera direction, pointer, overlay, collection state, and sneaker animation time before comparing. Compare room landmarks, sneaker silhouette/materials, lighting/reflection, then UI. Record scroll, drag, map, hotspot, keyboard, real touch, and reduced-motion behavior. Profile cold/warm load, frame-time distribution, GPU resources, draw calls, and long tasks on named devices. The report's 60 fps figure is a proposed goal, not a measurement of the reference.

**Setup to address:** `README.md` is only a title, no dependency lockfile is present, and dependencies were not installed at the time of this handoff. `beasttouch/app/globals.css` is untracked. Do not mistake these repository conditions for findings about the public reference.

## Shared completion rule

Every feature handoff names the state/scene interface it changes, the original or licensed assets it uses, the screen states it was checked in, and any remaining unverified behavior. Preserve the investigation's evidence labels; do not turn an inference into an observed fact.
