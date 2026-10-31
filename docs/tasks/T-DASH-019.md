# T-DASH-019 — Teacher Safe Space list

**Status:** Not started

## Depends on

T-DASH-004, T-DASH-005. Admin detail is T-DASH-013 and is a different role.

## Goal

Teacher Safe Space list with status filters and the privacy banner. No detail page.

## In scope

- `/teacher/safe-space` from `design/screens/teacher/safe_space_reports/Dashboard.png` through `Dashboard-3.png` (All, New, Reviewing, Addressed).
- `GET /api/teacher/safe-space/reports` with the `status` filter, scoped to the teacher’s classes. Honor the class switcher from T-DASH-015.
- Privacy banner copy from those screens.
- Shared table, badges (New, Reviewing, Addressed), empty, error, and loading.
- Document the columns that are actually on those four PNGs in `docs/API.md` before coding. Read the PNGs; do not copy the admin detail layout into this list.

## Out of scope

A teacher report detail route. `GET /api/teacher/safe-space/reports/:id` and `POST .../notes` are P1 and have no screen. Private notes. Changing assignee. Admin inbox.

## Screens

`design/screens/teacher/safe_space_reports/Dashboard.png`, `Dashboard-1.png`, `Dashboard-2.png`, `Dashboard-3.png`.

Inventory: `teacher.safe_space_list`. Status clear. No detail page.

## API

`GET /api/teacher/safe-space/reports`.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/teacher/safe-space/**`
- `wings_of_power_dashboard/src/features/teacher/safe-space/**`
- `docs/API.md` for the teacher report list fields only
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser: each filter changes the rows, the privacy banner is visible, and no control opens a detail page.
- Notes confirm the four list PNGs and the absence of a detail frame.

## Notes

-
