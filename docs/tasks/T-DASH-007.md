# T-DASH-007 — Admin dashboard

**Status:** Done

## Depends on

T-DASH-002, T-DASH-003, T-DASH-005. Shell already exists; this task fills `/admin`.

## Goal

Admin home from `design/screens/admin/dashboard/Dashboard.png`, backed by `GET /api/admin/dashboard`.

## In scope

- Before coding widgets, extend the `GET /api/admin/dashboard` row in `docs/API.md` with the fields this screen shows: greeting name, attention count, total students, total teachers, total classes, pending students, Mon–Fri reading and listening hours, story completion percent, quiz completion percent, story counts (published, drafts, archived), need-attention counts (class requests, student approvals, new Safe Space reports, follow-up), top students (name, grade, points, kindness), student total plus the breakdown the donut needs, recent activity (actor, sentence, time).
- KPI row, learning overview chart (Recharts; add the dependency here), story overview with Manage Stories → `/admin/stories`, need-attention Review links to `/admin/classes/requests`, `/admin/users/pending`, and `/admin/safe-space`, top students, donut, recent activity.
- Chart days Monday–Friday.
- The screenshot donut reads Boys 74% and Girls 55%. Display the percentages the API returns.
- Greeting uses the signed-in user. “7 items need your attention today.” uses the API attention count.
- Loading, error, and empty states from T-DASH-005.

## Out of scope

Admin Analytics page, Settings page, inventing a gender field if the contract work chooses a different breakdown the API already has. If the payload has no gender split, omit the donut labels rather than hardcoding 74 and 55, and note that in Notes.

## Screens

`design/screens/admin/dashboard/Dashboard.png`

## API

`GET /api/admin/dashboard`. Document fields in `docs/API.md` first.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/admin/page.tsx`
- `wings_of_power_dashboard/src/features/admin/dashboard/**`
- `wings_of_power_dashboard/package.json` and lockfile, for Recharts only
- `docs/API.md` for the dashboard response fields only
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser, as an admin, the home shows the four KPI cards, the week chart, and the three Review links land on the routes above.
- Error state appears when the dashboard request fails (throttle or a forced 500 in the test, plus one manual check if the API is up).

## Notes

- Checked `design/screens/admin/dashboard/Dashboard.png`. `GET /api/admin/dashboard` now lists the home fields in `docs/API.md`.
- Greeting uses the signed-in name. The attention line uses `attentionCount`. The chart is Monday–Friday reading and listening hours. Manage Stories goes to `/admin/stories`. Review goes to `/admin/classes/requests`, `/admin/users/pending`, and `/admin/safe-space`.
- Student records do not store gender (DATABASE collected fields, D18), so the contract has optional `students.segments` and does not add Boys/Girls. With no segments, the donut shows the total and no percent labels. The PNG’s 74 and 55 are not hardcoded.
- The PNG’s Grade dropdown and Recent Activity “View All” have no field or route in this contract, so they are not on the page.
- Browser, as an admin: four KPI cards (248, 18, 12, 04), Mon–Fri chart, and the three Review links open those routes (the destination pages are still 404 until their tasks). A forced 500 shows “Dashboard unavailable” and Try again, and stays on `/admin`.
- Lint, typecheck, 41 tests, and build passed. Recharts was added for the week chart.
