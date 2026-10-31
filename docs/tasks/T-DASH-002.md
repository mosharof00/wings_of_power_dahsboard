# T-DASH-002 — Tokens and layout shell

**Status:** Not started

## Depends on

T-DASH-001. Token values and nav tables are in [PLAN.md](../PLAN.md).

## Goal

Apply the sampled design tokens and render the authenticated shell: espresso sidebar, white top bar, role-specific nav, logout control. Admin and teacher placeholder pages prove the shell. They show the page title only.

## In scope

- CSS variables in `globals.css` for the tokens in the plan (`sidebar` `#150901`, `background` `#F5F5F5`, `card` `#FFFFFF`, `foreground` `#101830`, `muted-foreground` `#485070`, `primary` `#E87532`, `destructive` `#C3333F`, `success` `#18B030`, `info` `#1858A8`, `chart-1` `#F89050`, `chart-2` `#9060F8`, `border` `#E0E0E0`).
- Before loading a font, add a `docs/DECISIONS.md` row: the dashboard sans is Inter, because the PNGs do not name a family. Load Inter only.
- `(dashboard)` layout with sidebar and top bar.
- Admin nav and teacher nav from the plan. Analytics, admin Settings, and Stories & Questions render as disabled items with no `href`.
- Active item: white pill, orange label. Logout: destructive outline at the bottom of the rail.
- Top bar: orange title, search input (placeholder “Search students…”), bell, initial, display name. Search navigates to `/admin/users/students?q=` or `/teacher/students?q=` based on the placeholder role. Bell has no menu.
- Placeholder routes `/admin` and `/teacher` so both navs can be checked. A query such as `?as=teacher` is enough to switch the shell before T-DASH-003 supplies the real role. Remove that query switch in T-DASH-003’s Notes if the session replaces it; this task may leave the switch in place.
- Sidebar width about 280px at a 1440-wide viewport, matching the 2× export.

## Out of scope

Auth screens, real session, data fetching, charts, tables, copying KPI numbers onto the placeholder pages.

## Screens

- `design/screens/admin/dashboard/Dashboard.png` (chrome only)
- `design/screens/teacher/dashboard/Dashboard.png` (chrome only)
- `design/screens/teacher/settings/Dashboard.png` (teacher nav includes Profile and Settings)

## API

None.

## Allowed files

- `wings_of_power_dashboard/src/app/globals.css`
- `wings_of_power_dashboard/src/app/layout.tsx`
- `wings_of_power_dashboard/src/app/(dashboard)/**`
- `wings_of_power_dashboard/src/components/layout/**`
- `wings_of_power_dashboard/src/components/ui/**` for shadcn primitives this shell needs (button, input, avatar, separator)
- `docs/DECISIONS.md` for the Inter row only
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser, `/admin` shows the admin rail with Analytics and Settings disabled, Storie spelled as on the screenshot, and the active pill on dashboard.
- `/teacher` (via the temporary role switch) shows the teacher rail, with Stories & Questions disabled, and Profile and Settings present.
- The top bar search moves to the student list URL for that role.
- Notes record the Inter decision id.

## Notes

-
