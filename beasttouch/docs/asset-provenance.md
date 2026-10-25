# Asset provenance

This manifest tracks files used by the BeastTouch app. The public-site files in `investigation/evidence/` are research evidence and are outside the app; they are not cleared for reuse.

| App asset | Current use | Origin and rights | Action before public distribution |
|---|---|---|---|
| `public/images/beasttouch-01.png` | Product configuration, material detail, and bag dialogs; accessed only by `components/court/SneakerAsset.tsx` | Origin and license are not documented in this repository. SHA-256: `6530F56FE93A326DCC096C2FD50AF46060F48358800C9412655F2F3612D93CEC` | Establish creator/source, permission or license, and permitted uses. Replace through `SneakerAsset` if rights cannot be confirmed. |
| `public/images/court-poster.svg` | Initial court poster and fallback when WebGL is unavailable | Original SVG authored in this project on 26 October 2026. No external geometry or image assets. SHA-256: `CC8974AC9BF7E2E5C9A2D0C287C9A8D503F5113221C8F4D675951236B914CEEB` | Keep this record with the asset. |

For each new asset, add its relative path, creator or source URL, acquisition date, license or written permission, attribution requirement, modifications, and SHA-256. Keep license records with the project. A name or visual resemblance is not proof of permission.

Fonts currently load from Google Fonts through CSS. Record their selected families and applicable licenses when the final visual direction is chosen. Court architecture, hoops, painted lines, hardwood colour and normal maps, textile pattern, radial contact shadows, dust, and sneaker geometry are generated in `components/court/`. The environment is generated from studio light shapes; no HDRI is downloaded. These assets were authored for this project without importing investigation geometry or textures. No GLB is currently used; a future GLB needs its own license record before replacing the procedural model.
