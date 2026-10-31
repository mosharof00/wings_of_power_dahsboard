# T-DASH-016 — Teacher classes and students

**Status:** Not started

## Depends on

T-DASH-004, T-DASH-005, T-DASH-015 (class switcher may already exist; share it).

## Goal

Teacher class list, class detail, join-request review, student roster, and student detail.

## In scope

Use these crops, inside the shell from T-DASH-002:

- Class list: `design/screens/teacher/classes/Frame 2147259561.png` (class, code, students, pending, progress, pagination).
- Class detail tabs: `Frame 2147259576.png` through `-3.png` (overview, progress, students). Sample class on the art is Grade 3 Maple, code MPL-3R1. Render the API class.
- Join request dialog: `Frame 2147259604.png`. Approve and decline. `GET /api/teacher/classes/:id/join-requests`, `POST /api/teacher/join-requests/:id/approve`, `POST /api/teacher/join-requests/:id/reject`.
- Roster: `design/screens/teacher/srudents/Frame 2147259589.png`. `GET /api/teacher/students` with `classId`.
- Student detail: `GET /api/teacher/students/:id` at `/teacher/students/[id]`. There is no trustworthy teacher detail PNG. The `Frame 2147259576*` files under `srudents/` are an admin profile misfile and are unused. Show the fields the teacher endpoint returns (identity, class, progress, points, badges). Document those fields in `docs/API.md` first, limited to what a teacher already sees on the roster and the class detail crops.
- Routes: `/teacher/classes`, `/teacher/classes/[id]`, `/teacher/students`, `/teacher/students/[id]`.
- Class switcher updates both lists.

Ignore, as junk: `teacher/classes/Container*.png`, `Frame 1457*.png`, `Frame 2147259555.png`, and under `srudents/` the `Container*`, `Frame 1457`, `Frame 2147259555`, and `Frame 2147259590*` files.

## Out of scope

Admin move-class, admin approve-account (that is T-DASH-009). Rebuilding the admin Jonah Levy tabs. Safe Space detail.

## Screens

The five product crops named above. Inventory ids: `teacher.class_list_fragment`, `teacher.class_detail_fragment`, `teacher.review_join_request`, `teacher.student_roster_fragment`.

## API

Teacher class and student rows in `docs/API.md` section 9.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/teacher/classes/**`
- `wings_of_power_dashboard/src/app/(dashboard)/teacher/students/**`
- `wings_of_power_dashboard/src/features/teacher/classes/**`
- `wings_of_power_dashboard/src/features/teacher/students/**`
- `docs/API.md` for teacher class and student fields only
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser: open a class, switch overview / progress / students, approve a join request, decline one, open a student from the roster, switch class and see both lists change.
- Notes confirm the misfiled admin profile frames were not used.

## Notes

-
