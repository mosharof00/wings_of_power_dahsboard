# T-DASH-016 — Teacher classes and students

**Status:** Done

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

- Documented teacher class and student endpoints in `docs/API.md` section 9 (`GET /api/teacher/classes`, `GET /api/teacher/classes/:id`, `GET /api/teacher/classes/:id/join-requests`, `POST /api/teacher/join-requests/:id/approve`, `POST /api/teacher/join-requests/:id/reject`, `GET /api/teacher/students`, `GET /api/teacher/students/:id`).
- Implemented teacher class management in `src/features/teacher/classes/`:
  - `model.ts`: types, normalization, and helpers for class names, codes, pending banner messages, and progress formatting.
  - `api.ts`: API clients for class listing, detail, join requests, approval, and rejection.
  - `class-switcher.tsx`: shared class switcher dropdown component.
  - `class-list.tsx`: table showing class name, grade, join code, student count, pending request badge with clock icon, progress bar, last activity, and view action.
  - `class-detail.tsx`: class overview (stats, story completion, circular class progress), students tab with pending approval cards and enrolled students table, and learning progress tab with students needing support.
  - `join-request-dialog.tsx`: dialog matching design Frame 2147259604 with student preview, class details, Decline, and Approve actions.
  - `model.test.tsx`: unit tests for model normalization, banner text, and helper functions.
- Implemented teacher student management in `src/features/teacher/students/`:
  - `model.ts`: types and normalization for student roster, student detail, story progress, badges, and points history.
  - `api.ts`: API clients for student roster and student detail.
  - `student-list.tsx`: roster table showing avatar, student name, handle, student ID, class, kindness points, progress bar, safe space report count, search, and class switcher filter.
  - `student-detail.tsx`: student profile header (avatar, name, handle, class, joined date), metric cards (points, badges, chapters finished, quiz average), overview personal details & learning snapshot, reading progress across stories/chapters, and points & badges history.
  - `model.test.tsx`: unit tests for student item and detail normalization, status variants, and calculations.
- Implemented App Router pages:
  - `/teacher/classes` in `src/app/(dashboard)/teacher/classes/page.tsx`
  - `/teacher/classes/[id]` in `src/app/(dashboard)/teacher/classes/[id]/page.tsx`
  - `/teacher/students` in `src/app/(dashboard)/teacher/students/page.tsx`
  - `/teacher/students/[id]` in `src/app/(dashboard)/teacher/students/[id]/page.tsx`
- Confirmed that misfiled admin profile frames (`Frame 2147259576*` under `srudents/`, admin move-class, admin approve-account, and admin Jonah Levy tabs) were NOT used. The student detail view reflects only teacher-scoped endpoints and fields.
- Validations pass: `npm run lint` (0 errors, 0 warnings), `npm run typecheck` (passed), `npm test` (21 test files, 155 tests passed), and `npm run build` (successful production build).
