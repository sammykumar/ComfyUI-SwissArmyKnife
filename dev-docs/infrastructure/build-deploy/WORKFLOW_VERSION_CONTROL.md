# Workflow Version Control Plan (GitHub-Based)

## Purpose
Establish Git-backed workflow versioning inside ComfyUI-SwissArmyKnife so every saved workflow state and promotion event is tracked, reviewable, and deployable using GitHub branches and pull requests.

## Scope & Assumptions
- Git provider is always GitHub; remotes are configured via SSH or PATs stored **outside** the repository.
- Applies to all ComfyUI graph definitions handled by SwissArmyKnife, regardless of node type.
- React UI remains disabled; UX lives in existing plain JavaScript widgets.

## Architecture Overview
1. **Workflow Store**: Each workflow saved into `data/workflows/<workflow_id>/workflow.json` plus `metadata.yaml` capturing semantic version, author, timestamp, hash of inputs, and environment affinity.
2. **Environment Map**: `environments.yaml` declares Dev/QA/Prod (or more) and binds each to a GitHub branch (e.g., `dev -> main`, `qa -> qa`, `prod -> release`). File also lists promotion rules, protected inputs, and auto-sync flags.
3. **Git Automation Layer**: Python service wraps GitPython/libgit2 to perform commits, diffs, checkouts, and branch promotions. Commits follow `Workflow <id> vX.Y.Z` naming and run inside repo root. Promotions call fast-forward merges or spawn PRs via GitHub CLI if configured.
4. **API + Nodes**: Backend exposes REST helpers for listing versions, computing diffs, checking status, and triggering promotions. Optional "Promote Workflow" custom node allows workflow-driven deployments.
5. **Web Widgets**: New ComfyUI widget panel (`web/js/workflow_versions.js`) for listing history, viewing diffs, switching environments, and launching promotions.

## Key Capabilities
- Automatic commit on save, including metadata + workflow JSON.
- Environment switcher that checks out the mapped branch, reloads registered workflows, and warns about dirty states.
- Promotion pipeline enforcing "Dev → QA → Prod" with GitHub merge requirements (status checks, reviews, etc.).
- Diff summaries showing node additions/removals and parameter changes, surfaced via REST for the UI.

## Implementation Phases
1. **Foundation**
   - Define storage layout and metadata schema.
   - Implement Git service (commit, checkout, diff) and CLI diagnostics.
2. **Environment Binding**
   - Add `environments.yaml` parser, validation, and bootstrap command (`python -m nodes.workflow_git init-env`).
   - Document branch naming conventions and protected inputs.
3. **API & UI**
   - Publish REST routes + JS widgets for version lists, diffs, and environment switching.
   - Build Playwright smoke tests with mocked backend responses.
4. **Promotion Automation**
   - Implement promotion node + CLI for GitHub PR creation/merge.
   - Add safeguards for conflicts, drift detection, and unpushed commits.
5. **Docs & Examples**
   - Update `docs/nodes/...` for any new nodes, add example workflow under `docs/examples/`.
   - Expand `web/docs/` help pages for UI components.

## Testing & Validation
- Python unit tests (`tests/test_workflow_versioning.py`) run inside `.venv`.
- Git scenarios: offline repo, conflicting promotion, remote sync, and protected branch enforcement.
- UI validation through Playwright + manual ComfyUI browser refresh.

## Operational Guidance
- GitHub Actions should run `python -m nodes.workflow_git validate` to ensure metadata integrity before merges.
- Secrets (PATs, SSH keys) remain outside repo; rely on environment variables or system keychain.
- Large binary assets (checkpoints, cache) stay in existing locations; workflows only commit JSON + metadata and optionally reference assets via relative paths.

## Open Questions
1. How do we expose conflict resolution inside ComfyUI vs. requiring CLI/GitHub PR UI?
2. Do we support Git LFS for unusually large workflow files?
3. Should promotions auto-tag GitHub releases or rely solely on branch merges?
