# T-DASH-006 — Sign in and sign up

**Status:** Not started

## Depends on

T-DASH-002, T-DASH-003, T-DASH-005. Flow and endpoints are in [PLAN.md](../PLAN.md).

## Goal

Staff auth screens: admin registration, email code, shared sign-in, forgot password, set password, school profile, and teacher accept-invite.

## In scope

Build the split layout (illustration left, `#150901` panel right). Crop the hero from `design/screens/admin/signin_&_signup/Dashboard.png` into `public/auth/hero.png`. Omit the export’s device bezel.

| Route | Screen | Call |
|-------|--------|------|
| `/sign-in` | `Dashboard.png`, `Dashboard-2.png` | `POST /api/auth/staff/login` |
| `/sign-up` | `Dashboard-1.png` | `POST /api/auth/admin/register` |
| `/verify-email` | `Dashboard-3.png`, `Dashboard-7.png` | `POST /api/auth/admin/verify-email` |
| `/forgot-password` | `Dashboard-4.png` | `POST /api/auth/admin/forgot-password` |
| `/reset-password` | `Dashboard-8.png` | `POST /api/auth/admin/reset-password` |
| `/onboarding/school` | `Dashboard-5.png`, `Dashboard-6.png` | `POST /api/auth/school` |
| `/accept-invite` | Invite acceptance has no separate PNG. Use the set-password panel fields plus name, matching `POST /api/auth/teacher/accept-invite` | that endpoint |

- Sign-in fields: email, password, show/hide, Remember the device, Forgot Password, Sign In, link to sign-up. Remember-me uses the storage rule from T-DASH-003 (localStorage when checked, sessionStorage otherwise). The request body stays `{ email, password }`.
- Sign-up fields: full name, work email, password, confirm password. Confirm is client-only.
- After staff login, `ADMIN` goes to `/admin` unless school setup is still required, in which case `/onboarding/school`. `TEACHER` goes to `/teacher`. If `GET /api/auth/me` does not say whether the school exists, log that in `docs/OPEN_QUESTIONS.md` and use this proposed default: send a newly registered admin through school onboarding once, and skip it when `me` already includes a school.
- `Dashboard-9.png` is a duplicate of `Dashboard-7.png`. Implement the code screen once.
- `Sign Up.png` is the junk crop. No route uses it.
- Zod on every form. `401` on sign-in shows the envelope message on the form.

## Out of scope

Student login, class codes, Parent registration, a second teacher sign-up, admin Analytics.

## Screens

`design/screens/admin/signin_&_signup/Dashboard.png` through `Dashboard-9.png`. Exclude `Sign Up.png`.

## API

Auth module in `docs/API.md`: admin register, verify-email, staff login, forgot-password, reset-password, `POST /api/auth/school`, teacher accept-invite, `GET /api/auth/me`.

## Allowed files

- `wings_of_power_dashboard/src/app/(auth)/**`
- `wings_of_power_dashboard/src/features/auth/**`
- `wings_of_power_dashboard/public/auth/**`
- `docs/OPEN_QUESTIONS.md` only if school-setup cannot be read from `me`
- `docs/DECISIONS.md` only for that proposed default, and only after the open question exists
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- In the browser: sign-up validates empty fields; sign-in with a bad password shows the error and stays on the page; a successful staff login lands on `/admin` or `/teacher` according to role; accept-invite posts token, name, and password.
- Notes name which PNGs were checked, including the junk crop that was skipped.

## Notes

-
