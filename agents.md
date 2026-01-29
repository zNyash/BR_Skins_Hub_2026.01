# AI Agent Instructions & Codebase Standards

This document serves as the source of truth for AI agents (GitHub Copilot, etc.) working on this repository. Follow these rules strictly to maintain code quality, consistency, and the specific architectural philosophy of the project.

## 🧠 Core Philosophy

1.  **Simplicity Over Abstraction**: Do not over-engineer. Prefers simple, explicitly readable code over complex, "clever" abstractions.
2.  **Explicit Readability**: Use small helper functions (e.g., `closeModal()`, `resetForm()`, `resetLoadingState()`) inside components, even if they are one-liners. This makes the code self-documenting and easier for humans to parse.
3.  **Granular UX Feedback**: We value explicit loading states (e.g., "Uploading images...", "Saving to database...", "Refreshing...") over simple boolean `isLoading` spinners.

---

## 🛠 Coding Standards

### 1. Types (Convex)

- **ALWAYS** use the generated types from Convex.
- **NEVER** infer types manually from API return values if a `Doc` type exists.
- **NEVER** use `any`.

```typescript
// ✅ DO:
import type { Doc, Id } from "~~/convex/_generated/dataModel";
type Skin = Doc<"skins">;
type PlayerId = Id<"players">;

// ❌ DON'T:
type Skin = (typeof api.skins.listSkins._returnType)[0];
```

### 2. Modals

- **Parent-Controlled**: Modals must **not** have their own trigger buttons. They should be controlled via `v-model:open` (using `defineModel`) from the parent.
- **Structure**:
  ```vue
  <script setup>
  const isOpen = defineModel < boolean > ("open", { required: true });
  </script>
  ```

### 3. Form State

- Use the `useResettableRef` composable for form data to ensure easy resetting.
- **Pattern**:
  ```typescript
  const getDefaults = () => ({ name: "", age: 0 });
  const { state: form, reset: resetForm } = useResettableRef(getDefaults);
  ```

### 4. Submission & Actions

- Use the `useSubmitAction` composable for consistent error handling and toast notifications.
- **CRITICAL**: You must explicitly allow the developer to set specific status messages during the process. Do not abstract this away.
- **Pattern**:
  ```typescript
  const { handleSubmit, statusMessage } = useSubmitAction();

  const onSave = () => handleSubmit(async () => {
      statusMessage.value = "Validating...";
      if (invalid) return false; // Handled exit

      statusMessage.value = "Saving data...";
      await mutation(...);
  }, { successTitle: "Done!" });
  ```

### 5. Composables vs Components

- **Composables**: Should generally handle business logic and return state/methods.
- **Components**: Should generally handle UI side-effects (toasts) based on the composable's result, UNLESS using a dedicated UI-helper composable like `useSubmitAction`.

---

## 🚫 Anti-Patterns (Don'ts)

- **Don't** create "Trigger Buttons" inside Modal components.
- **Don't** catch errors inside components without updating a loading state or showing a toast (use `useSubmitAction` to handle this automatically).
- **Don't** remove the explicit `statusMessage.value = ...` updates when refactoring. These are required for UX.
