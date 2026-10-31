# T-DASH-014 — Game-show activity and match details

**Status:** Not started

## Depends on

T-DASH-004, T-DASH-005.

## Goal

Admin game-show rules and match history, plus 1v1 and 5v5 match details.

## In scope

- `/admin/game-show` from `Game Show Activity.png`. Show the eligibility rule: required stories, required chapters, minimum score. Screenshot and decision D2 defaults: 2 stories or 6 chapters, and at least 70%. Edit saves `PATCH /api/admin/game/eligibility-config`. Load with `GET` on that path.
- History table with the filters on that screen. `GET /api/admin/game/matches`.
- `/admin/game-show/[id]` from `Match Details.png` (1v1) and `Match Details-1.png` (5v5). `GET /api/admin/game/matches/:id`. Render each participant the payload returns (name, score, team). The repeated name on the PNGs is placeholder art.
- Document the config and match fields in `docs/API.md` before coding: mode `ONE_V_ONE` or `FIVE_V_FIVE`, scores, participants.
- Close returns to the history list.

## Out of scope

Live match control, matchmaking changes, teacher team balancing (decision 7: the system matches randomly), a second eligibility formula.

## Screens

`design/screens/admin/game_show_activity/Game Show Activity.png`, `Match Details.png`, `Match Details-1.png`.

## API

`GET /api/admin/game/matches`, `GET /api/admin/game/matches/:id`, `GET/PATCH /api/admin/game/eligibility-config`.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/admin/game-show/**`
- `wings_of_power_dashboard/src/features/admin/game-show/**`
- `docs/API.md` for eligibility-config and match-detail fields only
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser: edit the rule, reload and see it persist, open a 1v1 match and a 5v5 match, and see one row per participant from the fixture or API.

## Notes

-
