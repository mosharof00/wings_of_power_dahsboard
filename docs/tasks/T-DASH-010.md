# T-DASH-010 — Classes

**Status:** Done

## Depends on

T-DASH-004, T-DASH-005, T-DASH-008 (staff exist to assign as teachers).

## Goal

Admin classes: list, create with a join code, class details, change teacher, creation requests, and expired-code renewals.

## In scope

- `/admin/classes` from `Classess.png`. Columns: Class, Grade, Age Group, Code, Assigned Teacher, Students, Status, Class Created, Action. Expired badge on a dead code. Banner links to review requests. Tabs All Classes and Class Requests.
- Create dialog from `Create Class.png`: Class Name, Grade, Age Group, Assigned Teacher. Submit “Create & Generate Code” → `POST /api/admin/classes`. Success dialog from `Generate Code.png`: show the code, copy, share.
- `/admin/classes/[id]` from `Class Details.png` and `Class Details-1.png` (overview and students). Change teacher dialog from `Change Teacher Details.png` → `POST /api/admin/classes/:id/change-teacher`. Copy code on the detail page. Regenerate uses `POST /api/admin/classes/:id/codes`.
- `/admin/classes/requests` from `Pending Approval.png` and `Review Class Requests.png`. Reject and Approve & Generate Code → `POST /api/admin/class-requests/:id/reject` and `.../approve`.
- `/admin/classes/renewals` from `Expired Class Code Renewal Requests.png` and `-1.png`. `POST /api/admin/code-renewals/:id/approve` returns the new code for **that same class**.

Log these in `docs/OPEN_QUESTIONS.md` before building the conflicting controls, each with the proposed default from [PLAN.md](../PLAN.md):

1. Table age bands (5–6, 7–10, 9–12, 14–17, and others) versus the create placeholder “6-9 years” and decision 2 (6–9, 10–13, adults). Proposed default: the create control offers those three bands; the table prints `ageGroup` from the API unchanged.
2. Class Details header and detail card disagree. Proposed default: render the `GET /api/admin/classes/:id` record once.
3. Renewal art shows a Grade 3 request becoming a Grade 4 code. Proposed default: show the class on the renewal record.

Write the age-group default into `docs/DECISIONS.md` as well, pointing at the open question, before the select box is coded.

Search placeholder “Search by class or play mode”: search class name, grade, code, and teacher. Record that in `docs/DECISIONS.md`. Page subtitle on the PNG is the staff sentence “Manage school staff access.” Proposed subtitle, also in that decisions row: “Manage classes, join codes, and teacher assignment.”

## Out of scope

Teacher class views (T-DASH-016). Play-mode filters. A second age-band list copied from the table art.

## Screens

All PNGs in `design/screens/admin/classes/`.

## API

`GET/POST /api/admin/classes`, `GET /api/admin/classes/:id`, `POST .../change-teacher`, `POST .../codes`, `GET /api/admin/class-requests`, approve and reject, `POST /api/admin/code-renewals/:id/approve`.

Document list fields in `docs/API.md` first.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/admin/classes/**`
- `wings_of_power_dashboard/src/features/admin/classes/**`
- `docs/API.md` for class list and detail fields only
- `docs/OPEN_QUESTIONS.md` for the three conflicts above
- `docs/DECISIONS.md` for the age-group control, the search behavior, and the subtitle
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser: create a class and see a code, copy it, open details, change the teacher, approve a creation request, approve a renewal and see one new code for that class.
- Notes link the open-question entries.

## Notes

- Age band choice 6–9, 10–13, adults in create form; table prints API ageGroup as received (D33, OPEN_QUESTIONS Dashboard #2).
- Class details header and card render single GET /api/admin/classes/:id payload (D33, OPEN_QUESTIONS Dashboard #3).
- Expired class code renewal generates new code for same requested class (D33, OPEN_QUESTIONS Dashboard #4).
- Search query searches class name, grade, code, teacher; placeholder "Search by class or play mode" (D33).
- Page subtitle: "Manage classes, join codes, and teacher assignment." (D33).
