# Project agent instructions

This repository contains two distinct things: `investigation/` documents the public Finely Crafted website, while `beasttouch/` is an existing, independent Next.js sneaker concept. The investigation report's opening statement that no scaffold exists is now stale. Do not describe the BeastTouch app as a faithful reconstruction of the reference.

Read [agent.md](agent.md) for the three project roles and their shared interface. Read [skills.md](skills.md) before 3D scene work. Use [investigation/REPORT.md](investigation/REPORT.md) and its screenshots as observational evidence, preserving its observed, code-confirmed, inferred, and unverified distinctions.

The downloaded code and scene data in `investigation/evidence/` are research records. Do not copy their geometry, shaders, textures, fonts, logos, audio, video, or production bundles into `beasttouch/`. Author original assets or use assets with documented permission, and record provenance.

Coordinate scene, interface, and validation changes through the contracts in `agent.md`. Keep one persistent scene canvas; centralize navigation and transition state; ensure overlays, scroll, camera travel, and hotspot focus cannot issue competing transitions. Measure performance on named hardware rather than repeating proposed targets as measured results.

Preserve existing unrelated changes. Check repository status before editing or committing; other work may be happening in this shared workspace.
