# T-DASH-001 — Scaffold the dashboard

**Status:** Done

## Depends on

None. Read [PLAN.md](../PLAN.md) first. The dashboard folder has no Next.js app yet.

## Goal

Create the Next.js App Router application described in the plan, with the libraries installed and the validation scripts working. Product screens come later.

## In scope

- Next.js (App Router) + TypeScript strict, Tailwind, shadcn/ui initialized.
- Dependencies installed, unused until later tasks: `@tanstack/react-query`, `@tanstack/react-table`, `react-hook-form`, `zod`, `@hookform/resolvers`, `openapi-typescript`, `openapi-fetch`, `sonner`.
- npm scripts: `dev`, `lint`, `typecheck` (`tsc --noEmit`), `test` (Vitest), `build`.
- Root layout and a single `/` page that renders the product name and nothing else. No sidebar, no fake KPIs, no auth form.
- `.env.example` with `NEXT_PUBLIC_API_URL=http://localhost:6001/api`.
- `.gitignore` covering `.env`, `.env.local`, and build output.
- Vitest can run one passing test (for example `cn` or a render of the root page).
- Update `.cursor/rules/dashboard.mdc`: replace the “wait for a boilerplate” instructions with this stack, this folder layout, and these four commands. Point future tasks at `wings_of_power_dashboard/docs/PLAN.md`.

Record the installed versions in Notes.

## Out of scope

Tokens beyond Tailwind’s default setup (T-DASH-002), feature routes, API calls, auth, charts, a second package manager.

## Screens

None.

## API

None.

## Allowed files

- `wings_of_power_dashboard/package.json`
- `wings_of_power_dashboard/package-lock.json`
- `wings_of_power_dashboard/tsconfig.json`
- `wings_of_power_dashboard/next.config.ts` (or the extension `create-next-app` emits)
- `wings_of_power_dashboard/next-env.d.ts`
- `wings_of_power_dashboard/postcss.config.mjs`
- `wings_of_power_dashboard/eslint.config.mjs` (or the ESLint file the installer emits)
- `wings_of_power_dashboard/components.json`
- `wings_of_power_dashboard/vitest.config.ts`
- `wings_of_power_dashboard/src/app/layout.tsx`
- `wings_of_power_dashboard/src/app/page.tsx`
- `wings_of_power_dashboard/src/app/globals.css`
- `wings_of_power_dashboard/src/lib/utils.ts`
- `wings_of_power_dashboard/src/**/*.test.ts` and `src/**/*.test.tsx` created for the smoke test
- `wings_of_power_dashboard/.env.example`
- `wings_of_power_dashboard/.gitignore`
- `wings_of_power_dashboard/README.md` only if the installer generates it; keep it as run instructions
- `.cursor/rules/dashboard.mdc`
- This task file

## Done when

- `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` pass in `wings_of_power_dashboard/`.
- `dashboard.mdc` names this stack and those commands.
- Notes list package versions and confirm no feature route was added.

## Notes

- Scaffold only. The only App Router page is `/`, and it renders the text Wings of Power. No sidebar, auth form, or feature route.
- Installed on 31 Oct 2026: Next.js 16.4.3, React 19.3.0, TypeScript 5.9.3, Tailwind CSS 4.3.3, shadcn 4.23.0 (`shadcn init --defaults`, preset base-nova, neutral CSS variables). That init also wrote `src/components/ui/button.tsx` and `src/lib/utils.ts` (`cn` re-exported from the `cn` package).
- Libraries present and unused by the page: TanStack Query 5.105.0, TanStack Table 9.3.1, react-hook-form 7.91.0, zod 4.6.7, @hookform/resolvers 6.0.2, openapi-fetch 0.17.0, openapi-typescript 7.13.0 (dev), sonner 2.0.8. Vitest 5.0.5. `@types/node` is 22.20.5 so Vitest 5 can install.
- `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` passed. Build output routes: `/` and `/_not-found`.
- Product colors and the Inter font are still T-DASH-002. The scaffold font is the create-next-app Geist pair.
- `.cursor/rules/dashboard.mdc` now names this stack and the four commands, and points at `wings_of_power_dashboard/docs/PLAN.md`.
