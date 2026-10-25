# 3D inspiration and working guide

This guide translates observations from [the investigation](investigation/REPORT.md) into an original 3D direction for BeastTouch. It is a creative and technical brief, not a license to reproduce downloaded scene data or source materials. Three.js and React Three Fiber are choices for this project; the investigated site uses a custom WebGL renderer.

## Visual direction

- Build a lived-in, near-dark Indian street court with strong depth: foreground markings, receding walls, visible beams, a hoop, and a clear route for the camera. Give the BeastTouch setting its own signs, textures, and spatial details.
- Use warm pools of light against dark concrete and restrained cream markings. Let lighting guide the eye toward the shoe and the next navigable point.
- Model an original BT—01 sneaker in 3D. Readable silhouette, layered sole, woven textile, suede-like roughness, and a small contrast accent matter more than tiny surface detail. The current PNG can serve as concept art, but a flat image cannot provide changing perspective, self-shadow, or a coherent reflection.
- Compose for both 1440 × 900 and 390 × 844. Keep the shoe, hoop, court lines, and focal text legible without assuming desktop cropping works on portrait screens.

## Scene craft

1. **Block the shot.** Use simple original geometry to set scale, court arcs, hoop, walls, beams, and a sneaker placeholder. Save fixed camera poses for comparison.
2. **Author materials and light.** Establish concrete, textile, suede, rubber, and painted metal with clear roughness and scale. Add baked or authored illumination only after the unlit spatial composition reads well.
3. **Animate by the right clock.** Sample camera travel from normalized progress. Advance the sneaker yaw and subtle tilt from elapsed time. Trigger menu and interface motion from explicit state changes. These clocks should never be conflated.
4. **Add depth effects deliberately.** Prototype a reduced-resolution mirrored camera pass for the floor and restrained bloom around light sources. Provide a lower-cost mobile path. Check color handling and exposure against the same fixed shot.
5. **Anchor interaction in world space.** Attach each hotspot to a scene coordinate, project it into the HTML layer, and hide it when occluded or out of frame. A focused detail state owns camera movement until complete or cancelled.
6. **Profile and simplify.** Reuse geometry and materials, avoid per-render allocations, dispose GPU resources, and measure real frame times and memory on named devices. Tune DPR, reflection resolution, shadows, and postprocessing from measured costs.

## Motion cues from the public reference

The investigation confirms a continuous rotating shoe, progress-sampled camera/door tracks, a separate mirrored floor pass, bloom, and staggered map typography. It does not establish exact wheel travel, hover amplitude, touch-device behavior, or measured frame rate. Use these as direction for choreography, then validate the new experience on its own terms.

## Review checklist

- Original or licensed assets are recorded in the provenance manifest.
- Static compositions work at desktop and portrait sizes before adding transitions.
- Camera travel, shoe motion, UI transitions, and hotspot focus use their intended state and time sources.
- Opening an overlay blocks conflicting input and restores focus when closed.
- Reduced-motion mode has a stable camera and restrained scene motion.
- Reflection, bloom, and quality settings are checked with measured frame times; performance targets are labeled as targets.
