# T-DASH-005 — Forms, dialogs, toasts, badges, and states

**Status:** Not started

## Depends on

T-DASH-001 and the tokens from T-DASH-002.

## Goal

Shared form, dialog, toast, status badge, and empty / error / loading pieces so feature tasks do not invent their own.

## In scope

- shadcn Form wired to react-hook-form and zod (`zodResolver`). Helper that maps an API `400` field map and a top-level `message` onto the form.
- shadcn Dialog. Footer pattern from `design/screens/admin/classes/Create Class.png`: Cancel on the left, primary action on the right.
- sonner toaster mounted in the root layout. `toastSuccess({ title, description })` matches `design/screens/admin/staff_management/Toast.png`: bottom-right, check, title “Invitation Sent”, one description line. The helper is generic; the invite copy itself belongs to T-DASH-008.
- `StatusBadge` variants: `active`, `published`, `addressed` (success `#18B030`), `inactive` (destructive), `invitation` and `new` (info `#1858A8`), `pending` and `reviewing` (primary orange), `draft` (neutral), `expired` (destructive tint).
- `EmptyState`: title, one sentence, optional action. No illustration.
- `ErrorState`: `message` plus retry.
- `LoadingState`: card skeletons and a table-row skeleton the data table can reuse.
- Tests: badge variant renders its label; a zod form shows a required-field message; toast helper is callable.

## Out of scope

Feature forms (invite, create class, quiz). Copying Toast.png’s “Ms. Jhoson” into a fixture page.

## Screens

- `design/screens/admin/classes/Create Class.png` (dialog footer)
- `design/screens/admin/staff_management/Toast.png` (toast placement)
- Status chips on `Staff list.png`, `Student List.png`, and `Storie.png`

## API

None.

## Allowed files

- `wings_of_power_dashboard/src/components/ui/**` (form, dialog, sonner, badge, skeleton, label)
- `wings_of_power_dashboard/src/components/feedback/**`
- `wings_of_power_dashboard/src/app/layout.tsx` (toaster mount only)
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- A unit test locks each badge variant’s visible label (Active, Inactive, Invitation sent, Pending, Published, Draft, Expired, New, Reviewing, Addressed).

## Notes

-
