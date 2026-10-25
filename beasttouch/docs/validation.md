# Validation baseline

Use [the investigation report](../../investigation/REPORT.md) as evidence of the reference experience. Its screenshots are comparison references, not assets for the application. The report's statement that no scaffold exists predates the current `beasttouch/` app.

## Reproducible captures

For each comparison, record the date, browser and version, operating system, CSS viewport, device pixel ratio, route/area, travel progress, camera pose, pointer position, overlay, collected items, and animation time. Allow scene and UI transitions to settle. Fix or record the rotating shoe's elapsed time where possible. Capture both the reference and local app at matching conditions.

Start with the available evidence: `02-court-desktop-1440x900.png`, `04-map-1440x900.png`, `07-portrait-390x844.png`, and `08-portrait-map-390x844.png`. `01-court-entry-714x615.png` is the court after entry, not the loader. Compare court arcs, hoop, walls, and camera composition first; then shoe silhouette, lighting and reflections, typography, and interface placement. Record differences and the follow-up change in a comparison log.

## Interaction checks

- Enter and navigate by wheel, keyboard, pointer drag, and touch. Record a short timed interaction capture to assess travel and easing.
- Open and close the map; verify area selection and URL behavior where implemented.
- Open hotspots and detail views; test return behavior and collection state where implemented.
- Test focus order, Escape, modal focus containment, visible focus, and reduced motion.
- On a real touch device, check portrait composition, gestures, hit targets, and renderer fallback. A narrow desktop viewport is not a mobile-device test.
- In the local app, verify size/color selection, saved bag persistence after reload, edit and remove behavior, and invalid local storage handling.

Mark each feature as implemented, missing, or unverified. Do not treat a screenshot match as proof that the interaction matches.

## Performance log

Record the device and browser, cold and warm load times, frame-time distribution during ordinary travel and transitions, long tasks, draw calls, geometry and texture memory, render target sizes, and mobile/desktop graphics settings. A stable 60 fps on a named target desktop is a proposed acceptance goal, not a measurement of the reference. Set a mobile budget after measuring a real device. Distinguish observed values from targets and inferences.
