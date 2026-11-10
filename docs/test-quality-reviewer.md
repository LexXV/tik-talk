# Independent automated test reviewer

`.codex/agents/test-quality-reviewer.toml` defines the project agent
`test-quality-reviewer`, a Senior QA Automation Engineer / Test Architect.
It reviews another agent's tests independently; `testing-engineer` remains the
implementation agent. The reviewer returns the required seven-section
**Automated Test Quality Review**, with execution evidence, findings, prioritized
remediation and an explicit approval verdict.

## Usage

Start a fresh Codex session in this repository so the client can discover the
new agent, then ask:

> Delegate to test-quality-reviewer to independently review the automated tests
> implemented by testing-engineer. Inspect current source and docs/testing.md.
> Review the working tree and changes against [explicit base revision]. Keep the
> initial review read-only, run safe relevant suites, and return the complete
> Automated Test Quality Review. Do not modify tests or production code.

Replace the base revision with the intended comparison point, or explicitly ask
for a review of the current suite. Prefer a fresh reviewer context containing
the scope and implementation handoff, rather than the author's conclusions.
After remediation by the implementation agent, request an independent re-review
of the changed tests and affected scenarios.

## Boundaries and execution

The initial review does not edit source, tests, fixtures, configuration or docs.
Normal generated test output is allowed; mutation experiments must use a disposable
copy outside the reviewed working tree. The reviewer neither installs dependencies
nor accesses live APIs. A blocked command is reported, not silently repaired.
Subsequent requests for improvements produce a separate remediation plan.

The agent inherits its parent's model and permissions. Read-only behavior is an
explicit instruction, not an independently enforced sandbox: custom agent files
cannot override parent permissions according to the
[official custom agent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents).
For filesystem-enforced isolation, launch the parent review session with appropriate
read-only permissions and accept any resulting test execution limitations.

Clients without custom agent support can read the TOML's `developer_instructions`
and perform that role in the main session; that fallback is not an independently
spawned subagent. File syntax validation does not establish discovery or successful
agent execution in a fresh client. Creating this agent does not certify the suite;
approval requires an actual review and recorded test execution evidence.
