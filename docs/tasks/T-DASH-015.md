# T-DASH-015 — Teacher dashboard

**Status:** Not started

## Depends on

T-DASH-002, T-DASH-003, T-DASH-005, T-DASH-007 (Recharts is already a dependency).

## Goal

Teacher home from `design/screens/teacher/dashboard/Dashboard.png`.

## In scope

- Fill `/teacher` with `GET /api/teacher/dashboard`.
- Document response fields in `docs/API.md` first: safe-report count, flagged-response count, pending-student count, game-eligible count, leaderboard (avatar, name, kindness points, class), Mon–Fri quiz-average series, class progress (name and share), recent reports (reference, student, class, submitted, status), recent awards (student, category, points, time).
- Cards link onward: Safe Reports and the reports table → `/teacher/safe-space`, Pending Student → the class join queue in `/teacher/classes`, Game Eligible stays informational (eligibility is the admin rule from T-DASH-014), Award points → `/teacher/points`.
- Week axis Monday–Friday.
- Leaderboard widget: student avatar, student name, and game kindness points (decision 5). The PNG still draws hero characters; decision 5 is the locked correction for that widget. Say so in Notes.
- “Criteria not configured” on Flagged Responses: show the API count and its caption. Do not invent flag rules.
- Class switcher when `GET /api/teacher/classes` returns more than one class (decision D12). The dashboard query includes the selected class id.
- Shared loading and error states.

## Out of scope

Building the destination pages (those are 016, 019, 020). Character podium art. Team balancing.

## Screens

`design/screens/teacher/dashboard/Dashboard.png`

## API

`GET /api/teacher/dashboard`. `GET /api/teacher/classes` for the switcher.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/teacher/page.tsx`
- `wings_of_power_dashboard/src/features/teacher/dashboard/**`
- `docs/API.md` for the teacher dashboard fields only
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser, as a teacher: the four counts render, the week chart is Mon–Fri, leaderboard rows show avatar and name, and Safe Reports opens `/teacher/safe-space`.
- Switching class refetches the dashboard.

## Notes

-
