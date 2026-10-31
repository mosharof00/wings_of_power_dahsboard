# T-DASH-022 — Game-show question packs

**Status:** Not started

**Priority:** P1. Schedule after the P0 tasks. Decision D13: these screens are game-show question packs. Chapter quizzes are T-DASH-017.

## Depends on

T-DASH-005, T-DASH-011, T-DASH-017 (so the two editors are not mixed).

## Goal

The teacher Stories & Questions wizard: create a four-round game pack.

## In scope

- Enable the sidebar item Stories & Questions. It routes to `/teacher/game-packs`.
- Build the wizard from `design/screens/teacher/stories_&_questions/Dashboard.png` through `Dashboard-4.png`: age group, story and chapter selection, then the MCQ and written rounds the later frames show. Read each of those five PNGs and implement the steps they contain. Age options stay 6–9, 10–13, and adults (decision 2) unless a frame shows a control that conflicts; if it does, log `docs/OPEN_QUESTIONS.md` and keep the three locked bands as the proposed default.
- `CRUD /api/teacher/game-packs`. Document the pack body in `docs/API.md` before coding, including four rounds and the question types on the PNGs.
- `teacher/game_questions/**` is a byte-duplicate of this folder, including `Linear/Arrows/Arrow Right.png`. Use `stories_&_questions` only.
- The arrow PNG is junk (`teacher.stories_icon`). The Next button is a normal primary button.

## Out of scope

Chapter quiz `PUT /api/teacher/chapters/:chapterId/quiz` (T-DASH-017). Admin authoring of packs (`/api/admin/game-packs` stays unused unless OPEN_QUESTIONS client item 5 is answered). Uploading story media.

## Screens

`design/screens/teacher/stories_&_questions/Dashboard.png`, `Dashboard-1.png`, `Dashboard-2.png`, `Dashboard-3.png`, `Dashboard-4.png`.

Inventory id `teacher.stories_game_questions`. Status: ambiguous, game-builder.

## API

P1 `CRUD /api/teacher/game-packs` in `docs/API.md` section 8.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/teacher/game-packs/**`
- `wings_of_power_dashboard/src/features/teacher/game-packs/**`
- `wings_of_power_dashboard/src/components/layout/**` to enable the existing Stories & Questions item only
- `docs/API.md` for the game-pack body only
- `docs/OPEN_QUESTIONS.md` only if a wizard step clashes with decision 2 or D13
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser: start Create a New Game, set an age group, choose stories and chapters, complete the round steps that the five PNGs show, save, and reopen the pack.
- The chapter quiz editor from T-DASH-017 still saves a chapter quiz, unchanged.
- Notes say `game_questions/` and the arrow icon were not used.

## Notes

-
