# Asset provenance

This manifest tracks files used by the BeastTouch app. The public-site files in `investigation/evidence/` are research evidence and are outside the app; they are not cleared for reuse.

| App asset | Current use | Origin and rights | Action before public distribution |
|---|---|---|---|
| `public/images/beasttouch-01.png` | Hero sneaker, material detail, product configuration, bag | Origin and license are not documented in this repository. SHA-256: `6530F56FE93A326DCC096C2FD50AF46060F48358800C9412655F2F3612D93CEC` | Establish creator/source, permission or license, and permitted uses. Replace if rights cannot be confirmed. |

For each new asset, add its relative path, creator or source URL, acquisition date, license or written permission, attribution requirement, modifications, and SHA-256. Keep license records with the project. A name or visual resemblance is not proof of permission.

Fonts currently load from Google Fonts through CSS. Record their selected families and applicable licenses when the final visual direction is chosen. The court geometry in `components/CourtScene.tsx` and its procedural texture are defined in app code rather than imported scene assets.
