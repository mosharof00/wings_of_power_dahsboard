# T-DASH-018 — Teacher profile and settings

**Status:** Not started

## Depends on

T-DASH-003, T-DASH-005.

## Goal

Teacher profile and the settings tabs that have a contract: Account, Notification, Preferences, and password.

## In scope

- `/teacher/profile` from `design/screens/teacher/profile/Dashboard.png`. `GET/PATCH /api/teacher/profile`. Edit the identity fields on that screen.
- `/teacher/settings` from `design/screens/teacher/settings/Dashboard.png` through `Dashboard-4.png`. Tabs: Account, Notification, Preferences, Security.
- Account fields (display name, email, phone on `Dashboard.png`) and the notification and preference controls on `Dashboard-1.png`, `Dashboard-2.png`, and `Dashboard-3.png` save through `GET/PATCH /api/teacher/settings`. Read those three PNGs and list each control in `docs/API.md` as fields of the settings object before coding. Skip a control that needs its own endpoint; add it to `docs/OPEN_QUESTIONS.md` with a proposed default of “omit until the contract has a field.”
- Security password form (`Dashboard-4.png`): current, new, confirm. Confirm is client-only. `PATCH /api/auth/password` sends `current` and `next`.
- `Dashboard-5.png` is Active Sessions (device, browser, location, remote sign-out). API.md has no session list. Add an `docs/OPEN_QUESTIONS.md` entry before touching that panel. Proposed default: ship Security as the password form, and leave sessions out until a contract exists. Do not invent `GET /api/teacher/sessions`.

## Out of scope

Admin Settings. A session-revoke API. Student settings.

## Screens

`design/screens/teacher/profile/Dashboard.png`

`design/screens/teacher/settings/Dashboard.png`, `Dashboard-1.png`, `Dashboard-2.png`, `Dashboard-3.png`, `Dashboard-4.png`

`Dashboard-5.png` is the sessions gap, logged and not built.

## API

`GET/PATCH /api/teacher/profile`, `GET/PATCH /api/teacher/settings`, `PATCH /api/auth/password`.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/teacher/profile/**`
- `wings_of_power_dashboard/src/app/(dashboard)/teacher/settings/**`
- `wings_of_power_dashboard/src/features/teacher/profile/**`
- `wings_of_power_dashboard/src/features/teacher/settings/**`
- `docs/API.md` for profile and settings fields only
- `docs/OPEN_QUESTIONS.md` for sessions and any settings control with no field
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser: edit the display name, reload and see it stick; change notification toggles that were added to API.md; update the password with the wrong current password and see the form error.
- The sessions panel is absent, and Notes point at the open question.

## Notes

-
