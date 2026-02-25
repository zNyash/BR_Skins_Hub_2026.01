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
### 6. Vue 3.5+ Modern Syntax

- **Props Destructuring**: Use reactive props destructuring. Do **NOT** use `withDefaults` or `props.x`.
  ```typescript
  // ✅ DO:
  const { title = "Default", count } = defineProps<{ title?: string; count: number }>();
  // Use `title` directly in script and template. It stays reactive.

  // ❌ DON'T:
  const props = withDefaults(defineProps<Props>(), { ... });
  console.log(props.title);
  ```
- **Models**: Use `defineModel` for all v-model bindings.
  ```typescript
  const modelValue = defineModel<string>({ required: true });
  ```

---

## 🚫 Anti-Patterns (Don'ts)

- **Don't** create "Trigger Buttons" inside Modal components.
- **Don't** catch errors inside components without updating a loading state or showing a toast (use `useSubmitAction` to handle this automatically).
- **Don't** remove the explicit `statusMessage.value = ...` updates when refactoring. These are required for UX.

---

## Script Setup Organization Cheat Sheet (Vue 3 / Nuxt 3)

When generating or refactoring Vue 3 components using `<script setup>`, **ALWAYS organize the code following the section order and responsibilities below**.

Each section has **one single purpose**.  
Do NOT mix responsibilities between sections.

---

### // ------ Local Types & Defaults ------

**Purpose:**  
Declare **types, interfaces, enums, and default values** that are **local to the component**.

**Rules:**

- Types defined here MUST NOT be reused outside this component.
- Default objects or constants tightly coupled to the component belong here.
- Do NOT place runtime logic or reactive state here.

**Examples:**
**Use Reactive Props Destructuring** (Vue 3.5+). Do NOT use `withDefaults`.
- 
- `type LocalFormState`
- `interface UploadOptions`
- `const DEFAULT_STATUS = "idle"`

---

### // ------ Props & Emits ------

**Purpose:**  
Define the **public API** of the component.

**Rules:**

- Only `defineProps`, `defineEmits`, and `defineModel` are allowed here.
- No logic, no derived values, no side effects.
- Props typing must be explicit.

---

### // ------ External Composables ------

**Purpose:**  
Initialize **external dependencies and composables**.

**Rules:**

- Only composables imported from outside the component.
- Includes: `useRoute`, `useAppToast`, `useConvexMutation`, `useResettableRef`, `useSubmitAction`, etc.
- Do NOT define local refs or computed values here.
- If a composable exposes state, it is still initialized here.

---

### // ------ Local State ------

**Purpose:**  
Declare the component’s **reactive source of truth**.

**Rules:**

- Only `ref`, `reactive`, or `shallowRef`.
- No derived values.
- No side effects.
- This section defines _what the component knows_, not _what it does_.

---

### // ------ Computed ------

**Purpose:**  
Declare **derived state** based on local state, props, or composables.

**Rules:**

- ONLY `computed`.
- Must be deterministic and side-effect free.
- Must NOT mutate state.
- If logic becomes complex, extract it to a helper or composable.

---

### // ------ Watchers ------

**Purpose:**  
React to **state changes**.

**Rules:**

- Only `watch` or `watchEffect`.
- No reusable logic should live here.
- Side effects triggered by reactive changes belong here.
- Do NOT use watchers as a replacement for computed.

---

### // ------ Actions ------

**Purpose:**  
Define **intentional operations** that **mutate state and/or trigger side effects**.

**Rules:**

- Actions MAY:
  - mutate refs
  - call composables
  - perform async operations
- Actions represent _what the component does_, not event wiring.
- Actions are NOT pure functions.

**Examples:**

- `resetAll`
- `submitForm`
- `deleteItem`
- `closeModal`

---

### // ------ Handlers ------

**Purpose:**  
Bind **events to actions**.

**Rules:**

- Handlers are thin wrappers.
- They typically call one or more Actions.
- Prefer naming with `handleX`.

**Examples:**

- `handleSubmit`
- `handleClick`
- `handleDrop`

---

### // ------ Lifecycle ------

**Purpose:**  
Register lifecycle hooks.

**Rules:**

- Only Vue lifecycle hooks (`onMounted`, `onUnmounted`, etc).
- No logic definition here — only orchestration.
- Heavy logic must be delegated to Actions.

---

### General Rules

- Do NOT reorder sections.
- Do NOT skip sections if relevant.
- Do NOT mix responsibilities.
- If unsure where code belongs, ask:
  **"Is this state, derivation, reaction, or action?"**

---

## 📝 Git & Commit Guidelines

- **Commit Suggestions**: When asked for a commit message suggestion:
  1.  Analyze the changes made.
  2.  Provide **ONLY** the markdown text of the commit message (subject and body).
  3.  **DO NOT** execute the commit.
  4.  **DO NOT** generate a terminal command (like `git commit -m ...`).
  5.  Wait for the user to review and manually commit.
