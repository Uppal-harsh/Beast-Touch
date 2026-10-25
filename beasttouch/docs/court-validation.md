# Court implementation review

Use this checklist for the independent BeastTouch court. The reference captures in `investigation/evidence/` are observational baselines; no original scene data or media belong in the app.

## Fixed states

Capture the app at 390 × 844, 768 × 1024, and 1440 × 900 CSS pixels. At every size, capture the hero, hotspot hover/focus, and product dialog. Record browser, operating system, device pixel ratio, camera/travel progress, pointer location, overlay state, selected product state, reduced-motion setting, and animation time. Wait for loading and transitions before each still. If the sneaker rotates continuously, freeze or record its phase.

| State | What to inspect |
|---|---|
| Court entry | Court perspective, floor arcs, hoop, beams, sneaker silhouette, legibility of UI over the scene |
| Native page scroll | The document scrolls normally and the camera follows without cancelling wheel or keyboard events |
| Continued travel | Spatial continuity, clipping, floor response, camera collision, and frame times |
| Map open | Menu typography, background visibility, focus containment, blocked scene input |
| Detail/hotspot | Hotspot screen position, focus move, return path, camera ownership |
| Portrait court/map | Composition, sneaker and hoop visibility, touch target size, text overlap |
| WebGL failure | Whether the static court poster is shown with readable navigation and product access |

The reference screenshots establish a visual direction. Note each intentional BeastTouch difference as well as any mismatch being addressed. The reference's real WebGL scene, mirrored floor pass, bloom, and continuously rotating shoe are confirmed in the report, but its frame rate and exact wheel calibration were not measured.

## Interaction and accessibility

Check wheel, native arrow/Page keys, Escape, map selection, modal close, touch, and reduced motion. Opening an overlay should suspend scene navigation; closing it should restore focus and allow navigation. Verify that visible hotspots remain aligned with scene objects as the camera moves. Test WebGL context loss or disabled graphics; the SVG poster is wired into the page and all product information remains available through DOM controls.

## Performance and bundle record

After a production build, record a named device/browser and date. Measure cold and warm load, frame-time median and 95th percentile during travel, long tasks, draw calls, triangles, texture/geometry memory, render target size, and DPR. A 60 fps desktop goal is a proposal, not a reference measurement. Recheck a real touch device separately.

For bundle size, take the built JavaScript files that implement the 3D scene from `.next/static/chunks/`, report each raw byte count and a gzip byte count using the same tool/settings, then total them. Do not use the package's installed size or the downloaded reference chunks as the app bundle size. Record the route and exact chunk list because Next.js may split code between shared and route files. Compare before and after effects such as reflection, bloom, and loaders are added.
