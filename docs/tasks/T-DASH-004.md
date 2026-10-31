# T-DASH-004 — Data table

**Status:** Not started

## Depends on

T-DASH-001. Visual reference for density and the footer: `design/screens/admin/staff_management/Staff list.png` and `design/screens/admin/user_management/Student List.png`.

## Goal

One generic table: search, a filter slot, server pagination, and a row-action slot. Feature tasks supply columns and data.

## In scope

- TanStack Table component under `src/components/data-table/`.
- Search input controlled by the parent (`value`, `onChange`). Debounce lives in the component (about 300ms) and is covered by a test.
- `filters` React node, rendered on the right of the search row, as on the classes and student screens.
- Pagination props: `page`, `perPage`, `total`, `lastPage`, `onPageChange`. Footer text “Showing {from}–{to} of {total}” and a “{page} / {lastPage}” control with previous and next.
- Empty body uses the empty state from T-DASH-005 when that component exists. If 005 is not done yet, render a single muted line “Nothing to show.” and leave a prop `empty` the parent can replace. Do not build a second empty-state system if 005 already exported one.
- Loading: skeleton rows when `isLoading` is set.
- Row action slot. The component does not know about staff or students.
- Tests with a fake 80-row total: page 1 reads “Showing 1–12 of 80” when `perPage` is 12, and next calls `onPageChange(2)`.

## Out of scope

A product page that fetches students or staff. Column definitions for a real feature. Sorting on the server. A `playMode` query param.

## Screens

Chrome and footer only, from the two list PNGs named above. Column headers in those PNGs are not hardcoded here.

## API

Consumes the list shape `{ items, total, page, perPage, lastPage }` from `docs/API.md`. This task adds no route.

## Allowed files

- `wings_of_power_dashboard/src/components/data-table/**`
- `wings_of_power_dashboard/src/components/ui/table.tsx` and any shadcn table primitive it needs
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- The pagination test matches the “Showing 1–12 of 80” and “1 / 7” pattern.
- Notes confirm no feature route imports the table yet, or list the later task if one already does.

## Notes

-
