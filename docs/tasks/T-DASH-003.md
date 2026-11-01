# T-DASH-003 — API client and auth session

**Status:** Done

## Depends on

T-DASH-001 and T-DASH-002. Session rules are in [PLAN.md](../PLAN.md). Contract: `docs/API.md` sections 1 (Auth) and the pagination section.

## Goal

Generate a typed client from the backend OpenAPI document, unwrap the envelope, attach the bearer token, and guard `/admin` and `/teacher` by role.

## In scope

- `npm run openapi:generate` using `openapi-typescript`. Input, in order: `WINGS_OPENAPI_PATH`, then `../docs/openapi.json`, then `${NEXT_PUBLIC_API_URL}/docs-json`. If all three are missing, the script exits with a message that names those sources. Do not commit a hand-written spec.
- `src/lib/api/client.ts`: `openapi-fetch` wrapper. Unwrap `{ success, message, data }`. Pagination helper typed as `{ items, total, page, perPage, lastPage }`.
- `Authorization: Bearer` from storage. `401` clears storage and routes to `/sign-in`. `403`, `409`, and `422` surface `message`.
- Write the session decision into `docs/DECISIONS.md` before the storage code: `sessionStorage` key `wop.accessToken`; `localStorage` for the same key when “remember” is set later by T-DASH-006; no refresh token.
- `GET /api/auth/me` hydrates the user. `POST /api/auth/logout` then clears storage.
- `(dashboard)` layout uses the session. No user: redirect to `/sign-in`. An `ADMIN` who opens `/teacher/**` goes to `/admin`. A `TEACHER` who opens `/admin/**` goes to `/teacher`. Any other role goes to `/sign-in`. Render nothing until hydration finishes.
- Remove the `?as=teacher` shell switch from T-DASH-002 once the session provides the role.
- Middleware redirects `/` to `/sign-in` only.
- QueryClient provider on the root layout.
- Unit tests for envelope unwrapping and the role redirect decision (pure function). The generate script is allowed to be unrun in CI if no spec exists; the test suite still passes.

Sign-in, sign-up, and the other auth screens are T-DASH-006. This task may add a temporary `/sign-in` page that only explains the screen arrives in 006, so the guard has a destination.

## Out of scope

Pixel-perfect auth forms, remember-me checkbox UI, school onboarding, feature queries.

## Screens

None. Guard behavior is specified in the plan.

## API

- `GET /api/auth/me`
- `POST /api/auth/logout`
- Client must also expose the other auth paths from API.md section 1 so T-DASH-006 can call them: admin register, verify-email, admin login, staff login, forgot-password, reset-password, school, teacher accept-invite, `PATCH /api/auth/password`.

## Allowed files

- `wings_of_power_dashboard/package.json` (script only)
- `wings_of_power_dashboard/src/lib/api/**`
- `wings_of_power_dashboard/src/lib/auth/**`
- `wings_of_power_dashboard/src/app/layout.tsx`
- `wings_of_power_dashboard/src/app/(dashboard)/layout.tsx`
- `wings_of_power_dashboard/src/app/(auth)/sign-in/page.tsx` (placeholder only)
- `wings_of_power_dashboard/src/middleware.ts`
- `docs/DECISIONS.md` for the session row only
- This task file

## Done when

- Lint, typecheck, test, and build pass.
- Tests cover unwrapping and the three redirect cases (anonymous, teacher hitting admin, admin hitting teacher).
- With a stored admin token, `/admin` renders the shell. With no token, it sends the browser to `/sign-in`.
- Notes say whether `openapi.json` was present.

## Notes

- Session storage is decision **D25**. Key `wop.accessToken`. `writeAccessToken(token, remember)` is ready for the T-DASH-006 checkbox. No refresh token.
- `../docs/openapi.json` was not present, and `WINGS_OPENAPI_PATH` was unset. `npm run openapi:generate` exits with a message that names `WINGS_OPENAPI_PATH`, `../docs/openapi.json`, and `${NEXT_PUBLIC_API_URL}/docs-json`. `src/lib/api/schema.ts` types the staff auth paths from API.md section 1 until that script replaces it. It is not a hand-written OpenAPI document.
- The `?as=` rail switch is gone. The shell follows the path after the role guard. The top bar shows the name from `GET /api/auth/me`.
- Next.js 16 prints a deprecation warning for `middleware.ts` and still runs it. `/` redirects to `/sign-in`.
- Checked in the browser: no token on `/admin` goes to `/sign-in`. An admin token renders the admin shell. A teacher opening `/admin` lands on `/teacher`. An admin opening `/teacher` lands on `/admin`. `/admin?as=teacher` stays on the admin rail.
- Lint, typecheck, test (13), and build passed.

