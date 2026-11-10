# Testing architecture and testing-engineer

Baseline inspected on 2026-11-10. This change establishes a reusable agent and
test strategy; it does not implement the proposed suite or certify reliability.

## Architecture assessment

- Angular standalone application in `apps/tik-talk`; package range 21.2.7,
  installed core 21.2.19. Nx 23.0.1, NgRx 21.1.1 range, RxJS 7.8,
  TypeScript 5.9.2 range. `tsconfig.base.json` defines `@tt/*` library aliases.
- Feature libraries: auth, profile, posts, communities, chats, news, layout,
  common-ui, shared, experimental. Data access centralizes APIs and NgRx.
  Root bootstrap/config provides HTTP, router, runtime configuration and store;
  routes register feature reducers/effects. Chats and communities have nested
  routes; chats loads through a dynamic import.
- `libs/data-access/src/lib/auth/api/auth.service.ts` posts login FormData,
  persists access/refresh cookies, restores tokens via `isAuth`, refreshes tokens,
  and clears cookies/navigates to login on logout or refresh failure.
  `libs/auth/src/lib/auth/access.guard.ts` returns true or a login UrlTree.
  The layout route is guarded; login and experimental routes are public.
  There are no role-based guards here, and token presence is not expiry validation.
- `auth.interceptor.ts` attaches bearer tokens, bypasses DaData, and refreshes on
  HTTP 403. Its module-level BehaviorSubject coordinates refresh requests.
  A refresh failure appears to leave this flag true; this is an inspection finding
  requiring a deterministic reproduction, not a verified runtime diagnosis.
- `libs/data-access/src/lib/{profile,posts,communities}/store` contains action
  groups, createFeature reducers, selectors, and injected effects. Profile and
  community filtering combines latest filters/page state with switchMap;
  community creation uses exhaustMap; comment loading uses mergeMap. Effects
  generally lack explicit error actions/catchError. Do not assume failure recovery.
- `ApiService` wraps HttpClient with the runtime API base URL. Domain services
  define endpoint contracts. Chats also uses signals, GlobalStoreService, and
  a WebSocket adapter; not all state is NgRx. Runtime configuration, third-party
  suggestions, cookies and WebSocket traffic must be isolated in tests.
- Main journeys: login to own profile, search profiles, edit settings/avatar,
  read/create posts and comments, browse/create/join/leave communities, and chat.

## Existing tooling and constraints

Library targets use `@nx/jest:jest`, Jest 30.3 and jest-preset-angular 16 with
zone TestBed setup, strict unknown-element/property checks, HTML transforms and
library coverage directories. Root Jest discovers Nx projects. The application
target uses `@angular/build:unit-test`; Vitest is installed. Preserve these
distinct targets rather than migrating frameworks as part of a test task.

No tracked-source `*.spec.ts` or `*.test.ts` files, shared test fixtures, or mocking
conventions were found. Existing library setup/configuration is the convention
to extend. No Playwright/Cypress dependency, browser test configuration, or e2e
target was found. An existing coverage directory alone is not current evidence.
Nx defaults `passWithNoTests` to true; CI test configuration enables coverage,
but GitLab CI has no test job or coverage publishing. Its lint job calls an absent
`yarn lint` script. CI uses Node 20.11 whereas `.nvmrc` specifies v24.19.0;
resolve toolchain compatibility before relying on CI. No coverage threshold was found.

Use explicit project targets rather than the ambiguous root `yarn test` script.
From the repository root, after dependencies and the Node toolchain are ready:

```sh
yarn nx test auth --runInBand --skip-nx-cache --passWithNoTests=false
yarn nx test data-access --runInBand --skip-nx-cache --passWithNoTests=false
yarn nx run-many -t test --projects=auth,data-access --configuration=ci --runInBand --skip-nx-cache --passWithNoTests=false
```

These are implementation-time commands, not claims of a passing suite. At the
baseline they should fail for absent tests. Use `--listTests` for discovery only.
Coverage belongs in `coverage/libs/<project>`. Add a CI gate only after real tests
execute reliably; preserve existing deployment jobs.

## Small initial suite

| Priority / layer | Scenarios and meaningful outcomes |
| --- | --- |
| P0 auth unit/integration | Guard returns true with a token and a login UrlTree without one; cookie restoration; successful login stores both tokens; refresh failure clears session and redirects. |
| P0 HTTP interceptor | Bearer attachment, tokenless and third-party bypass, non-403 propagation, refresh/retry with new token; concurrent 403s share refresh, and failure does not strand later requests. Reproduce the suspected defect before a focused fix. |
| P1 NgRx | Filter resets page/results, next page appends immutably, selectors return correct pagination and post-specific comments; profile effect emits payload and cancels obsolete requests; comment requests remain independent; community creation suppresses overlapping submissions. |
| P1 browser | Protected deep link redirects to login; synthetic login reaches own profile; create a post and see it in feed. Stub all API/config/WS boundaries, assert rendered results, fail unexpected requests, reset browser state per test. |

Treat error recovery and authorization gaps as explicit findings rather than
encoding known bugs as desired behavior. Begin with auth and one representative
NgRx pipeline, then expand only for distinct risks. Browser runner setup is a
separate justified addition; no extra dependency is needed for initial unit tests.

## Agent and invocation

`.codex/agents/testing-engineer.toml` defines the project-scoped custom agent.
The installed CLI reports `codex-cli 0.166.0` (JetBrains ACP wrapper 2.6.0).
The standalone TOML format follows the official
[custom agent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents).
It inherits the parent's model and permissions. No global configuration changes
or feature flag overrides are needed. Restart the Codex session after adding it;
project configuration may require the repository to be trusted by the client.

In Codex opened at this repository, ask:

> Delegate to testing-engineer to review testing maturity and propose the smallest high-value suite. Read docs/testing.md and inspect current implementation first.

For implementation:

> Delegate to testing-engineer to implement and run the initial authentication and representative NgRx tests described in docs/testing.md, then report remaining browser-test gaps.

The agent owns gap analysis, scenarios, implementation, asynchronous testing,
validation, flake diagnosis and documentation. Every review must state maturity,
evidence and prioritized gaps. Clients without custom subagent support can use
the same instructions directly: ask Codex to read the TOML's developer_instructions
and perform that role in the main session. This fallback is not a spawned agent.

## Validation of this change

Only agent configuration and documentation are introduced. No production code,
dependencies, tests or CI settings change. CLI version and installed dependency
versions were inspected; source/config inventory established the baseline.
Agent registration/execution in a fresh client session must be distinguished
from syntax validation; no authenticated nested Codex session was launched.
