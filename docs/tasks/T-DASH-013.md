# T-DASH-013 — Admin Safe Space reports

**Status:** Not started

## Depends on

T-DASH-004, T-DASH-005.

## Goal

Admin Safe Space inbox and report detail: filter, assign, note, and change the teacher on the report.

## In scope

- `/admin/safe-space` from `Safe space report.png`, `New.png`, `Reviewing.png`, `Addressed.png`. Counts, category, table, search, status filters New / Reviewing / Addressed.
- `/admin/safe-space/[id]` from `View report details/` (`new.png`, `reviewing.png`, `reviewing-1.png`, `Change.png`). Show narrative, feel-safe, status, assignee. Actions: assign, add note, change teacher, move status along New → Reviewing → Addressed as those frames do.
- `GET /api/admin/safe-space/reports`, `GET/PATCH /api/admin/safe-space/reports/:id` (`status`, `assigneeId`), `POST .../notes`.
- Notes entered here are staff notes. The student report body stays category, text up to 200 characters, and feel-safe.
- Document table and detail fields in `docs/API.md` before coding.
- Empty, error, and loading states on both pages.

## Out of scope

The teacher list (T-DASH-019). A teacher detail page. In-game calm visits. Reading a private student journal. The UI-kit frame named Notes.

## Screens

`design/screens/admin/safe_space_reports/**`

## API

Admin Safe Space rows in `docs/API.md` section 7.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/admin/safe-space/**`
- `wings_of_power_dashboard/src/features/admin/safe-space/**`
- `docs/API.md` for report list and detail fields only
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser: filter to New, open a report, assign a teacher, add a note, set Reviewing, then Addressed, and see the list badge follow.
- A teacher token that requests this URL is redirected to `/teacher`.

## Notes

-
