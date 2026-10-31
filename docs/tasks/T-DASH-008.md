# T-DASH-008 — Teachers and staff

**Status:** Not started

## Depends on

T-DASH-003, T-DASH-004, T-DASH-005, T-DASH-006.

## Goal

Admin staff list, invite, profile, edit, reminder, and reactivate. User Management tabs (Staff, Students, Pending Approvals) share a header; student and pending bodies are T-DASH-009.

## In scope

- Routes: `/admin/users/staff`, `/admin/users/staff/[id]`, edit on the profile or `/admin/users/staff/[id]/edit` matching `Edit Staff.png`.
- List from `Staff list.png` and `Action Button.png`: columns Staff (name and handle), Contact (email and phone), ID, Role, Assigned Class, Students, Status, Action. Pagination through the shared table. Search uses the page search “inside” the list as well as the top bar `q`.
- Status badges: Active, Invitation sent, Inactive (the list shows both a green and a red Inactive; map API status, and use the destructive badge for inactive).
- Invite dialog from `Invitaion.png` (filename typo). `POST /api/admin/staff/invite` with email and `canAccessSafeSpace`. Success toast matches `Toast.png`.
- Profile from `View profile.png` and `View profile-1.png` (active versus invited). Edit from `Edit Staff.png`. Reactivate from `Reactivate.png` via `POST /api/admin/staff/:id/reactivate`.
- Reminder action: the contract has no reminder route. Add `POST /api/admin/staff/:id/remind` to `docs/API.md` before enabling the menu item, described as resending the invite. If that edit is rejected by the contract’s “no endpoint without a screen” bar, the screen **is** the reminder row action, so the edit belongs in API.md.
- Counselor label: before coding the Role column, add this to `docs/DECISIONS.md`: a `TEACHER` with `canAccessSafeSpace` displays as Counselor; a `TEACHER` without it displays as Teacher. Do not add a Counselor role to the API.
- Tabs link to `/admin/users/students` and `/admin/users/pending` even if 009 is unfinished (those routes may 404 until then; the tab hrefs are still correct).

## Out of scope

Student rows, Parent invites, a Counselor account type, admin Settings.

## Screens

`design/screens/admin/staff_management/` — `Staff list.png`, `Action Button.png`, `Invitaion.png`, `View profile.png`, `View profile-1.png`, `Edit Staff.png`, `Reactivate.png`, `Toast.png`.

## API

`GET /api/admin/staff`, `POST /api/admin/staff/invite`, `GET/PATCH /api/admin/staff/:id`, `POST /api/admin/staff/:id/reactivate`, plus the remind route added to `docs/API.md` first.

Document list fields the columns need, in API.md, before coding.

## Allowed files

- `wings_of_power_dashboard/src/app/(dashboard)/admin/users/**`
- `wings_of_power_dashboard/src/features/admin/staff/**`
- `docs/API.md` for staff list fields and the remind route only
- `docs/DECISIONS.md` for the Counselor display row only
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser: list paginates, invite validates email and shows the toast on success, edit saves, reactivate confirms, an invited row can send a reminder.
- Notes quote the DECISIONS id for the Counselor label.

## Notes

-
