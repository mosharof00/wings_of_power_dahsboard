# T-DASH-011 — Stories and books upload

**Status:** Not started

## Depends on

T-DASH-003, T-DASH-004, T-DASH-005.

## Goal

Admin story library plus an editor for age group, chapters, page images, and chapter audio.

## In scope

- `/admin/stories` from `Storie.png` and `Storie-1.png`. Columns: cover, title, author, chapter count, age group, status (Published / Draft), updated, actions (publish, edit, delete). Search. Filters: age group and status.
- Age options: All, 6–9, 10–13, adults (decision 2). The sample rows that all say author “12” and chapter “04” are placeholder cells. Render API values.
- Kindness Corner tab is visible and disabled. Task 021 owns it.
- `/admin/stories/new` and `/admin/stories/[id]`. No editor PNG exists. The editor contains only the upload flow from `docs/API.md`: title and metadata, age group, publish state, chapters, pages with images, chapter audio.
- Uploads: `POST /api/uploads` with purpose `STORY_COVER`, `PAGE_IMAGE`, or `CHAPTER_AUDIO`, then save the returned `url` on the story, page, or audio record.
- Publish: `PATCH /api/admin/stories/:id`.
- Trash icon: add `DELETE /api/admin/stories/:id` to `docs/API.md` before wiring it. The database already soft-deletes Story. The button archives or soft-deletes; the list then shows the story as unpublished or gone, matching what the endpoint returns. Document which of those the endpoint does, in API.md, and implement that.
- Endpoints used after the contract edit: `GET/POST /api/admin/stories`, `PATCH /api/admin/stories/:id`, `POST /api/admin/stories/:id/chapters`, `PUT /api/admin/chapters/:id/pages`, `PUT /api/admin/chapters/:id/audio`.

## Out of scope

Teacher media upload. Kindness Corner videos. Game-show question packs. PDF books.

## Screens

`design/screens/admin/storie/Storie.png`, `Storie-1.png`. Editor layout follows the dashboard shell and the shared form, because no editor frame was exported.

## API

Content and upload rows in `docs/API.md` sections 2 and 10. Add `DELETE /api/admin/stories/:id` there first. Document list fields (cover, title, author, chapter count, age group, status, updated) there first.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/admin/stories/**`
- `wings_of_power_dashboard/src/features/admin/stories/**`
- `docs/API.md` for the story list fields and the delete route only
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser: create a story, set age group 10–13, add a chapter, upload a cover and a page image and an audio file, save as draft, publish, and see the library status change. Delete removes it from the published list according to the contract note.
- A teacher session that opens `/admin/stories` is redirected to `/teacher`.

## Notes

-
