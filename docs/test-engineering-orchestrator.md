# Test engineering orchestrator

The project-scoped `.codex/agents/test-engineering-orchestrator.toml` defines a
Test Engineering Lead. It preserves the existing `testing-engineer` (implementation)
and `test-quality-reviewer` (independent review) definitions. No global settings,
dependencies, application code or test infrastructure are changed by this setup.

## Invoke in Codex

Open this repository in a fresh Codex session so custom roles can be discovered.
Ask:

> Delegate to test-engineering-orchestrator to coordinate testing-engineer and test-quality-reviewer for a focused authentication, NgRx and critical-workflow suite. Follow its strategy, implementation, independent review, remediation and final validation lifecycle.

For planning without test edits:

> Delegate to test-engineering-orchestrator for strategy only. Inspect the current suite and propose prioritized scenarios and acceptance criteria. Do not implement tests.

These are natural-language delegation requests, not CLI subcommands. The standalone
file format follows the [official Codex subagent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents).
No model or permission override is configured. Project trust, client permissions
and available delegation depth/concurrency still apply.

The orchestrator reads both role files and verifies their `name` fields against
the client's available agent types. In the current host the supported mechanism
is `collaboration.spawn_agent` with `agent_type` set to `testing-engineer` or
`test-quality-reviewer`, followed by the exposed message/follow-up/wait tools.
Future sessions must verify their tool surface rather than assuming these names.
The new orchestrator role may require a new session to appear. No registration or
authenticated runtime smoke test is implied by static configuration validation.

If a spawned orchestrator cannot delegate at its nesting depth, ask the main
Codex thread to read its `developer_instructions` and coordinate the two registered
roles itself. This is main-thread orchestration, not a spawned orchestrator.
If either specialist is unavailable, report the blocker; do not substitute a
single-agent implementation and call it independently reviewed.

## Lifecycle and handoffs

1. Recheck source, configuration, current tests and dirty-tree baseline. Define a
   small risk-ranked scenario matrix and observable acceptance criteria.
2. Assign implementation to `testing-engineer`, including ownership, architecture,
   mocking/dependency constraints, commands and expected evidence.
3. Freeze changed files and hand their exact revision/diff and untracked inventory
   to `test-quality-reviewer` for its independent read-only seven-section report.
4. Triage every finding with a stable ID and explicit disposition. The implementer
   corrects valid issues; the reviewer rechecks meaningful changes. Allow at most
   two remediation rounds after the initial review. Report unresolved blockers.
5. Execute final relevant tests, inspect the final diff, check completion criteria
   and produce the engineering report. Never call an empty or unexecuted suite a pass.

Each handoff supplies the absolute workspace, revision, changed files and explicit
context. Agents confirm filesystem visibility before relying on shared changes.
The lead owns decisions, the implementer owns test edits, and the reviewer owns
independent assessment. Critical/High limitations require explicit documentation;
the iteration limit alone cannot turn incomplete work into completion.

## Reconnaissance baseline (2026-11-10)

See `testing.md` for architecture and candidate commands. Source/configuration
inspection confirmed Angular standalone features, Nx 23.0.1 package declarations,
NgRx effects and Jest library targets with strict zone TestBed setup. The app uses
the separate Angular unit-test executor; Vitest is declared. No source test files
or configured browser runner were found. Existing coverage output is not evidence
of current coverage. No repository AGENTS.md was found.

AuthService posts FormData, persists/restores cookies and clears the session on
logout/refresh failure. The guarded layout redirects unauthenticated navigation
to login; successful login navigates to the root/profile route. Interceptor refresh
coordination uses module-level state and merits deterministic failure/concurrency
testing. Profile/community filters use switchMap, comments mergeMap, and community
creation exhaustMap. Effects generally lack explicit error recovery actions; the
orchestrator must expose this gap without inventing requirements or normalizing bugs.
Candidate integrated journeys are login to profile and post creation to visible feed.

GitLab CI runs dependency/lint/build/deploy jobs, with no automated test job.
Nx permits empty Jest suites by default and defines a CI coverage configuration.
CI Node 20.11 differs from `.nvmrc` v24.19.0; the lint job calls an absent package
script. These are constraints to report and reassess, not changes authorized here.

The existing reviewer classifies actionable findings as Critical/High/Medium/Low.
Informational observations are requested separately to preserve its report format.
The initial setup does not certify application coverage, CI compatibility or
portfolio readiness and deliberately does not begin test implementation.
