# T-DASH-017 — Chapter quiz upload and edit

**Status:** Not started

## Depends on

T-DASH-005, T-DASH-011 (stories exist to attach quizzes to). Decision A4: the teacher uploads the quiz for a chapter, and the quiz is based on that chapter’s story.

## Goal

Let a teacher open a published story’s chapter and create or edit its comprehension quiz.

## In scope

This task is the chapter quiz CMS (`GET` and `PUT /api/teacher/chapters/:chapterId/quiz`).

The PNGs in `design/screens/teacher/stories_&_questions/` are a four-round game wizard. They are T-DASH-022. Do not build that wizard here.

There is no chapter-quiz screenshot and no teacher story list in the contract. Before the picker UI:

1. Add `GET /api/teacher/stories` to `docs/API.md`. Response: published stories the teacher may attach quizzes to, each with `id`, `title`, `ageGroup`, and chapters `{ id, title, order }`. No upload fields.
2. Extend the quiz `PUT` body note so it matches a chapter quiz: ordered questions, each with prompt, options, the correct option, and an optional hint. Written answers and game-round numbers stay out of this payload.

Then build:

- A picker of those stories and chapters, linked from the teacher shell at `/teacher/chapters` (a plain list, not a new sidebar item; Stories & Questions stays the disabled nav entry until T-DASH-022).
- `/teacher/chapters/[chapterId]/quiz`: add, edit, reorder, and remove questions; save via `PUT`. Reload shows the saved quiz.
- Zod requires a prompt and at least two options, and exactly one correct option, on each question.
- The teacher does not upload covers, page images, or audio on this page.

## Out of scope

`design/screens/teacher/stories_&_questions/**` and `teacher/game_questions/**`. Age-group game setup. Round 1–4 builders. Admin story media.

## Screens

No exported frame. Use the dashboard shell, the shared form, and the shared empty state. The game-wizard PNGs are the wrong feature.

## API

`GET /api/teacher/stories` (added first), `GET /api/teacher/chapters/:chapterId/quiz`, `PUT /api/teacher/chapters/:chapterId/quiz`.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/teacher/chapters/**`
- `wings_of_power_dashboard/src/features/teacher/quizzes/**`
- `docs/API.md` for the teacher story list and the quiz body only
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser: pick a story and chapter, add two questions, mark a correct option, save, reload, and see the same questions. Validation blocks a question with no correct option.
- Notes state that the Stories & Questions PNGs were left for T-DASH-022.

## Notes

-
