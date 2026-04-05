# Workflow: Adding a Player Field

Use this workflow when adding a new field to the `players` data model.

## 1. Update Schema

Edit `convex/schema.ts` and add the new field in the `players` table.

Example:

```ts
new_field: v.optional(v.string());
```

## 2. Update Convex Functions

Edit `convex/players.ts` and keep both create and update paths in sync.

- Add field to create arguments and insert payload.
- Add field to update arguments and patch logic.

## 3. Update Sync Logic

Edit `app/composables/usePlayerSync.ts`.

- Compare previous field value against incoming value.
- Include changed field in update mutation payload.

## 4. Update UI Forms

Update relevant components to create and edit the field.

Typical files:

- `app/components/modals/CreatePlayer.vue`
- `app/components/modals/EditPlayer.vue`

Checklist:

- Add form controls.
- Add validation if needed.
- Add field to mutation payload.
- Keep loading and toast messaging consistent.

## 5. Verify Type Safety and Security

- Use generated Convex types where applicable.
- Validate server-side input for new field behavior.
- Confirm no sensitive data is exposed.

## 6. Validate End-to-End

- Create player with the new field.
- Edit player and confirm persistence.
- Confirm sync flow updates only changed fields.
- Confirm toasts and loading states are clear.
