# Alpha Protocol Upgrade Proposal: Bridging the Gap to FAANG Standards

**status**: Draft for Product Manager Review
**author**: Antigravity (Agent)
**date**: 2026-02-11

## Executive Summary
The current Alpha Protocol relies heavily on Agent diligence ("Honor System"), which introduces a single point of failure: the Agent itself. A true FAANG-grade system enforces compliance via **inescapable mechanical gates** (Scripts/CI), not guidelines. 

The following table highlights specific gaps identified during the `RALPH-003` execution failure and proposes concrete technical solutions.

## Gap Analysis: Current vs. Proposed

| Feature Area | Current Alpha Protocol (Flawed) | FAANG Standard (Target State) | Proposed Technical Implementation |
| :--- | :--- | :--- | :--- |
| **Gate Enforcement** | **Manual**: Agent must "remember" to consult the protocol. | **Automated**: CI/CD scripts block progression. | `npm run gate:check` script that must pass before `npm run dev` or `git commit` is allowed. |
| **Environment Integrity** | **Assumed**: Agent assumes `localhost` ports/keys are correct. | **Validated**: Pre-flight checks verify connectivity. | `scripts/validate-env.ts`: Pings DB, checks Auth keys, verifies ports (54321 vs 55321) on startup. |
| **Testing Strategy** | **Reactive**: Write code -> Run tests -> Fail -> Loop. | **Proactive (TDD)**: Test Failure Artifact required *first*. | **TDD Lock**: Middleware that rejects code changes unless a corresponding `.spec.ts` file exists and has failed exactly once. |
| **Root Cause Analysis** | **Ad-hoc**: Agent flails with blind fixes. | **Structured**: Standardized debug dumps. | `npm run gate:debug`: Auto-generates a `debug_report.json` with network logs, DB state, and recent errors before allowing fixes. |
| **Failure Handling** | **Infinite Loop**: Agent can retry indefinitely. | **Circuit Breaker**: Hard stop after N failures. | **Analysis Timeout**: If a test fails 3x, the test runner locks for 5 minutes, forcing the Agent to read logs. |

## Immediate Action Items for Engineering

1.  **Create `validate-env` Script**:
    -   Verify `NEXT_PUBLIC_SUPABASE_URL` matches the actual running Supabase instance.
    -   Check if the Auth service is responsive.

2.  **Implement "Stop the Line" Logic**:
    -   Add a counter to the test runner. If `failure_count > 2`, abort with: *"PROTOCOL VIOLATION: Stop and Analyze."*

3.  **Formalize TDD Evidence**:
    -   Require a "Failure Screenshot" or "Failure Log" to be saved to `docs/evidence` *before* implementation code is committed.
