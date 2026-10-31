# T-DASH-012 — Admin points and badges

**Status:** Not started

## Depends on

T-DASH-004, T-DASH-005.

## Goal

The points-and-badges configuration page: three rules, six badges, and history.

## In scope

- `/admin/points` from `design/screens/admin/badges_&_points/Points & Badges.png`.
- Summary cards: total positive points, total kindness points, total badges (six).
- Point rules, editable, saved with `PATCH /api/admin/point-rules`: Story Points (per question, screenshot default 1), Kindness Points (per defense round, default 50), Teacher Award (default 5). These match decision D8.
- Six badges via `GET/PATCH /api/admin/badges`: Kindness Champion, Story Explorer, Game Show Ready, Helping Hand, Speak Up, Positive Leader. Keep each card’s “how to earn” text and the Automatic versus Given by Teacher label from the screenshot. Edit the threshold fields the screenshot shows as inputs.
- History table: Student, Category, Points, Reason, Awarded By, When. Search, date range, class filter. Pagination. Categories returned by the API, including Game Points when present, display as labels. Do not add a fourth rule input for game points.
- Document the rule and badge payloads in `docs/API.md` before coding, using the numbers and names on the screenshot.

## Out of scope

Teacher award UI (T-DASH-020). New badge names. Thresholds that are not on the screenshot or already stored.

## Screens

`design/screens/admin/badges_&_points/Points & Badges.png`

## API

`GET/PATCH /api/admin/point-rules`, `GET/PATCH /api/admin/badges`. History reads the ledger the admin page needs; if API.md has no admin history route, add `GET /api/admin/points/history` to `docs/API.md` first (paginated, same columns as the table) and then call it.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/admin/points/**`
- `wings_of_power_dashboard/src/features/admin/points/**`
- `docs/API.md` for point-rule, badge, and history fields only
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser: change story points from 1 to another number, save, reload, and see the saved value. Badge text for the six names matches the screenshot. History paginates.

## Notes

-
