# Testing architecture and testing-engineer

Baseline inspected on 2026-11-10. The focused suite described below is now
implemented. The architecture/tooling assessment records the original baseline;
passing focused tests do not certify all application behavior.

## Executable focused suite

Run from the repository root with installed dependencies (Windows PowerShell:
use `yarn.cmd` if script execution policy blocks `yarn.ps1`):

```sh
yarn nx run-many -t test --projects=auth,data-access,profile --runInBand --skip-nx-cache --passWithNoTests=false
```

| Project / spec | Regression protection |
| --- | --- |
| data-access / auth.service.spec.ts | FormData login; 401/500 errors without creating sessions; cookie persistence/restoration; token replacement on refresh; logout and refresh-failure cleanup/navigation. |
| auth / auth.interceptor.spec.ts | Bearer, tokenless and DaData boundaries; non-403 errors; shared concurrent refresh; new requests queue during refresh; one completed retry per request; failed-refresh waiters and requests after a new login. |
| data-access / profile.effects.spec.ts | Current filters/pagination in real HTTP; cancellation of stale requests; correct result payload; API failure without false success. |
| data-access / post.effects.spec.ts | Independent concurrent comment requests with out-of-order responses and correct post IDs. |
| data-access / community.effects.spec.ts | Duplicate creation suppressed while pending; a later creation succeeds with its own payload. |
| profile / profile-page.workflow.spec.ts | Protected navigation to login, required-field validation, real login/session/router/profile loading, blank-post rejection, real create-post effect/reducer/selector and rendered feed; cookie-based navigation and logout protection. |

The workflow suite runs Angular TestBed and RouterTestingHarness in Jest/jsdom,
using production login/profile/feed/input/post components, guard, interceptor,
HTTP services and NgRx store/effects. Its route fixture omits the layout/chat
shell; it does not verify the production route configuration itself. HTTP and
runtime config are the external boundaries: HttpTestingController verifies
outstanding requests; cookies and subscriptions are cleaned between tests.
No dependencies, browser runner or live API are needed. These are integration
tests, not browser E2E or backend authorization tests.

### Demonstrated production correction

Before changing the interceptor, `yarn.cmd nx test auth --runInBand
--skip-nx-cache --passWithNoTests=false` executed four tests: two passed and two
failed. Concurrent 403s produced two `/second` retries instead of one; refresh
failure notified only one of two waiting requests. The flag-based coordinator
left subscribers waiting/reissuing requests. A shared refresh observable now
multicasts the token or error, finalizes coordinator state, and lets refresh HTTP
reach the backend without waiting on itself. The same four tests then passed.
This is the only production correction in the focused-suite change.

### Current execution and remaining gaps

Implementation validation on Node 24.22.1 / Yarn 1.22.22: the combined command
above (using `yarn.cmd`) exited 0: auth 1 suite / 6 tests, data-access 4 suites /
10 tests, profile 1 suite / 2 tests; 18 passed, none failed/skipped. Independent
review also returned APPROVED WITH RECOMMENDATIONS. Its Low finding TQR-01
requested direct coverage of a new request arriving during refresh; the added
test verifies no premature HTTP, one shared refresh, new bearer headers and
exactly one emission/completion per request. After this addition, `yarn.cmd nx
test auth --runInBand --skip-nx-cache --passWithNoTests=false` exited 0 with 1
suite / 7 passed tests and no failed/skipped cases. Independent re-review
resolved TQR-01 with no new actionable findings. Both the reviewer and lead
reran the combined uncached command: 6 suites / 19 tests passed, none
failed or skipped.

The additional `yarn.cmd nx build tik-talk --configuration=development
--skip-nx-cache` attempt exited 1: esbuild reported `Cannot read directory
"../..": Access is denied` and could not resolve source/styles/zone.js. The lead
reran the same command with elevated sandbox permissions: exit 0, application
bundled successfully. Existing Angular unused-import/optional-chain warnings and
Sass deprecation warnings remain; the initial failure was a sandbox limitation.

- Effects generally have no catchError/failure actions or UI loading/error
  contracts. The profile failure test proves error propagation and no false
  success; it does not establish recovery after failure. NgRx's default effect
  resubscription is not tested here. Recovery/error UX is a follow-up architectural
  gap, not a newly invented success requirement.
- LoginPage subscribes without an error handler and logs successful tokens.
  Rejected-login UI feedback/retry is not protected by this suite; service-level
  401/500 behavior is covered. Address error UX and token logging before making
  production-readiness claims.
- No real-browser E2E, production-shell routing, server authorization, token-expiry
  validation, settings/avatar, community UI, chat/WebSocket or backend coverage.
- CI still has no test job; Node/version and lint-script issues below remain.
  The suite is a local regression foundation, not an automated deployment gate.

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

## Historical validation of the agent setup

Only agent configuration and documentation are introduced. No production code,
dependencies, tests or CI settings change. CLI version and installed dependency
versions were inspected; source/config inventory established the baseline.
Agent registration/execution in a fresh client session must be distinguished
from syntax validation; no authenticated nested Codex session was launched.
