# T-DASH-009 — Students

**Status:** Not started

## Depends on

T-DASH-004, T-DASH-005, T-DASH-008 (the User Management tab shell). If 008 has not landed, this task also creates the tab header.

## Goal

Admin student list, pending approval, student details, and move class.

## In scope

- `/admin/users/students` from `Student List.png` and `Student List-1.png`. Columns: Student (name, handle), ID, Class, Positive Points, Progress, Reports, Status, Action. Filter “All classes”. Search by name or username, including the top-bar `q`.
- Status badges Active, Pending, Inactive. Row menu: View, Review (pending), Reactivate (inactive), matching the inventory.
- `/admin/users/pending` is the Pending Approvals tab: rows waiting on `POST /api/admin/students/:id/approve`. This is account verification (decision D1), separate from the teacher join-request dialog in T-DASH-016.
- `/admin/users/students/[id]` from `Details.png` through `Details-4.png`, `Inactive Student Details.png`, and `Pending Student Details.png`. Show the tabs and fields on those frames. Actions that the frames show: Move class, Reactivate, Review.
- Move class dialog: `Move to another class.png`. `POST /api/admin/students/:id/move-class` with `classId`.
- Reactivate and status changes: `PATCH /api/admin/students/:id` with `ACTIVE` or `INACTIVE`.
- Document list and detail fields in `docs/API.md` before coding.
- Loading, error, empty, and pagination use the shared components.

## Out of scope

Teacher roster (T-DASH-016). Cloning the misfiled teacher-folder copies of these details. Parent contact fields.

## Screens

`design/screens/admin/user_management/` — all PNGs in that folder.

## API

`GET /api/admin/students`, `GET/PATCH /api/admin/students/:id`, `POST /api/admin/students/:id/approve`, `POST /api/admin/students/:id/move-class`.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/admin/users/students/**`
- `wings_of_power_dashboard/src/app/(dashboard)/admin/users/pending/**`
- `wings_of_power_dashboard/src/features/admin/students/**`
- Shared user-management tab component under `src/features/admin/staff/` or `src/components/layout/` only if 008 did not already export it; prefer importing 008’s tabs
- `docs/API.md` for student list and detail fields only
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser: filter and search the list, open a student, move them to another class, approve a pending student, reactivate an inactive student. Each action updates the status shown when you return to the list.

## Notes

-
