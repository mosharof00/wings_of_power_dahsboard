# T-DASH-021 — Kindness Corner

**Status:** Blocked

## Depends on

T-DASH-011 for the Storie page tab. Do not start the upload field until the block below is resolved.

## Goal

Admin Kindness Corner list and add flow, after the image-versus-video clash is decided.

## Block

`design/screens/admin/storie/Kindness Corner.png` is a list of videos. `Kindness Corner-1.png` is an add dialog whose media field is labeled as an image. Inventory id `admin.kindness_corner`: ambiguous. API.md marks kindness-corner CRUD and `KINDNESS_MEDIA` as P1.

Before any upload code, add an `docs/OPEN_QUESTIONS.md` entry. Proposed default: treat the item as a video (`KINDNESS_MEDIA` accepts the video MIME the contract already names, or mp4 if the contract must name one), and change the dialog label to video. Wait for a decision if the product owner is available. The list page may be built only after that entry exists, and the file input must follow the decision. Do not ship both an image picker and a video picker.

## In scope, once unblocked

- Enable the Kindness Corner tab on `/admin/stories`, route `/admin/stories/kindness-corner`.
- List from `Kindness Corner.png`. Add dialog from `Kindness Corner-1.png`, with the media field matching the decision.
- `CRUD /api/admin/kindness-corner` and `POST /api/uploads` purpose `KINDNESS_MEDIA`.
- Document fields in `docs/API.md` first.

## Out of scope

A student Kindness Corner destination (no student screen; P2 in API.md). Story chapter uploads (T-DASH-011).

## Screens

`design/screens/admin/storie/Kindness Corner.png`, `Kindness Corner-1.png`.

## API

P1 kindness-corner rows in `docs/API.md` sections 2 and 10.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/admin/stories/kindness-corner/**`
- `wings_of_power_dashboard/src/features/admin/stories/kindness-corner/**`
- The tab trigger in the stories feature, only to enable the link
- `docs/API.md` for kindness-corner fields only
- `docs/OPEN_QUESTIONS.md` for the media-type entry
- `docs/DECISIONS.md` only after the open question is answered or the proposed default is explicitly accepted
- This task file

## Done when

- The open question is in `docs/OPEN_QUESTIONS.md` before implementation.
- After the media type is fixed: lint, typecheck, test, and build pass, and the browser flow lists items and adds one with the decided file type.
- Until then, Status stays Blocked and no file input is merged.

## Notes

-
