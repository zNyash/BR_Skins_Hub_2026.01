# AI Agent Instructions and Codebase Standards

This document is the source of truth for AI agents working in this repository.
Rules in this file are mandatory unless the user explicitly overrides them.

## 1. Tooling and Execution Defaults

- Use Bun for dependency and script management.
- Use `bun install` to install dependencies.
- Use `bun run <script>` to run project scripts.
- Use `bunx <tool>` for one-off CLIs.
- Prefer bash-style commands and command syntax.
- If the environment blocks bash usage on Windows, PowerShell fallback is allowed.

## 2. Stack Defaults

- Nuxt is the app framework.
- Nuxt UI is the component UI system.
- Convex is the backend data layer.
- Pinia is the state store for shared state.

## 3. Architecture Rules

- Keep components single responsibility.
- Use Pinia when state or actions are shared across pages or domain boundaries.
- Keep local UI-only state in the component or a focused composable.
- Abstract hard logic into composables or helpers.
- Do not abstract trivial logic that is clearer inline.
- Favor simple, explicit code over clever abstractions.

## 4. Naming and Readability Rules

- Use descriptive and consistent names for functions, variables, and types.
- Prefer readability at first glance over short or clever naming.
- Keep files and functions small enough to change safely.
- If a type is too complex inline, move it to a dedicated type file.

## 5. Vue and Nuxt Script Setup Order

Use the same section order across the app for `<script setup>`:

1. Imports
2. Local types
3. Props and emits and models
4. External composables
5. Local state (group by kind: string, number, boolean, array, object)
6. Actions (small readable helpers are allowed)
7. Handlers
8. Watches
9. Lifecycle
10. Other items that do not fit above

Additional rules:

- Keep related code together.
- Use reactive props destructuring.
- Use `defineModel` for `v-model` contracts.

See [docs/agent-standards/script-setup-order.md](docs/agent-standards/script-setup-order.md) for full examples.

## 6. UX Feedback Standards

- Use explicit loading states for async operations.
- Keep status text specific to the current step.
- Keep toast messaging consistent across admin and user flows.
- Do not remove explicit status updates during refactors.
- Prefer `useSubmitAction` for submit flows where applicable.

See [docs/agent-standards/toast-loading-consistency.md](docs/agent-standards/toast-loading-consistency.md) for detailed patterns.

## 7. Type Safety and Convex Rules

- Always use generated Convex types from `~~/convex/_generated/dataModel`.
- Never use `any`.
- Never replace available `Doc` or `Id` types with inferred alternatives.
- Keep mutations, queries, and actions type safe end-to-end.

## 8. Security Baseline

Every implementation and review must include a security check.

- Validate untrusted input on the server.
- Do not trust client-side validation for security decisions.
- Enforce auth and authorization at server boundaries.
- Avoid exposing secrets or sensitive fields to the client.
- Check new code for obvious vulnerabilities and unsafe assumptions.

See [docs/agent-standards/security-checklist.md](docs/agent-standards/security-checklist.md) for the required checklist.

## 9. Modal and Interaction Rules

- Avoid modal overuse; do not create modal-heavy workflows.
- Keep the dashboard strategy that avoids modal hell.
- Modal open state must be parent controlled via `v-model`.
- Modal components must not include their own trigger buttons.

## 10. Commit Message and Git Behavior

- When asked for a commit message, return only commit message text.
- Do not execute git commit commands unless explicitly requested.
- If changes are large, suggest smaller, logical commits.

## 11. Detailed Standards and Workflows

- Overview and rationale: [docs/agent-standards/overview.md](docs/agent-standards/overview.md)
- Script setup ordering: [docs/agent-standards/script-setup-order.md](docs/agent-standards/script-setup-order.md)
- Security checklist: [docs/agent-standards/security-checklist.md](docs/agent-standards/security-checklist.md)
- Loading and toast consistency: [docs/agent-standards/toast-loading-consistency.md](docs/agent-standards/toast-loading-consistency.md)
- Workflow: adding a player field: [docs/workflows/adding-player-field.md](docs/workflows/adding-player-field.md)
