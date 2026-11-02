# T-DASH-020 — Teacher points and badges

**Status:** done

## Depends on

T-DASH-004, T-DASH-005, T-DASH-012 (admin rules exist; this task awards within them).

## Goal

Teacher award, badge monitor, and points history.

## In scope

- `/teacher/points` using `design/screens/teacher/points_&Padges/Frame 2147259733.png`, `-1.png`, and `-2.png` (Award, Monitor, History). Place those panels in the teacher shell. The crops are partial; the shell comes from T-DASH-002.
- Award: categories and amounts +1 through +5, student, reason. `POST /api/teacher/points/award` with `studentId`, `amount`, `category`, `reason`. Amount stays in 1..5 as on the crop.
- Monitor: `GET /api/teacher/badges/monitor` matrix for the six badges.
- History: `GET /api/teacher/points/history`, paginated, in the shared table.
- Class switcher filters all three tabs.
- Document request and response fields in `docs/API.md` before coding, using the crops.
- Ignore chrome slices in the same folder: `Container.png`, `Container-1.png`, `Container-2.png`, `Frame 1457.png`, `Frame 1457-1.png`, `Frame 1457-2.png`.

## Out of scope

Editing global point rules (T-DASH-012). New categories beyond the crop. Badge threshold changes.

## Screens

`design/screens/teacher/points_&Padges/Frame 2147259733.png` and the `-1` and `-2` states. Inventory id `teacher.points_badges` (ambiguous partial shell). The chrome files are junk.

## API

`POST /api/teacher/points/award`, `GET /api/teacher/points/history`, `GET /api/teacher/badges/monitor`.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/teacher/points/**`
- `wings_of_power_dashboard/src/features/teacher/points/**`
- `docs/API.md` for the teacher award, history, and monitor fields only
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser: award 5 points to a student with a reason, see the history row, and open the badge matrix. An amount outside 1..5 does not submit.
- Notes name the chrome files that were skipped.

## Notes

- Implemented `/teacher/points` page with 3 tabs: Award Points, Badge Monitor, and History.
- Skipped chrome slices as specified: `Container.png`, `Container-1.png`, `Container-2.png`, `Frame 1457.png`, `Frame 1457-1.png`, `Frame 1457-2.png` (as well as duplicate header/sidebar exports `teacher_points_overview.png`, `teacher_points_award_form.png`, `teacher_points_award_modal.png`, `teacher_points_award_confirm.png`, `teacher_points_student_list.png`, and `teacher_badges_overview.png`).
- Documented `POST /api/teacher/points/award`, `GET /api/teacher/points/history`, and `GET /api/teacher/badges/monitor` in `docs/API.md`.
- Form validation ensures awarded points are bounded strictly within 1..5.
- Class switcher integrated across all three tabs.
- Auto-refresh invalidates cache on points award.
- Unit and model tests cover schemas, validation, data normalization, and static markup rendering.
- All checks pass: lint (0 errors, 0 warnings), typecheck, vitest (26 test files, 234 tests), next build.
