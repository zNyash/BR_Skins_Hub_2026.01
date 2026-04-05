# Security Checklist

Run this checklist for every implementation and review.

## Server Boundary Checks

- Validate request input on the server.
- Reject invalid or unexpected payload shapes.
- Enforce authorization on server endpoints and Convex mutations.
- Do not rely on client-only guards for security.

## Data Exposure Checks

- Return only fields needed by the caller.
- Do not expose secrets, tokens, or private configuration.
- Keep private values out of public runtime config.

## Auth and Access Checks

- Confirm admin-only actions require admin validation.
- Confirm user-specific operations verify ownership or access rights.
- Confirm sensitive actions are not callable from unauthorized contexts.

## Input and Output Checks

- Sanitize or strictly validate untrusted input.
- Avoid unsafe interpolation in logs, queries, or generated content.
- Return consistent error responses without leaking internals.

## Operational Safety Checks

- Confirm rate limiting is applied where abuse is possible.
- Confirm retries and error handling do not create duplicate writes.
- Confirm failure paths keep state consistent.

## Convex and Type Safety Checks

- Use generated Convex types for docs and ids.
- Avoid `any` and unsafe casts for data-layer code.
- Keep mutation arguments explicit and validated.
