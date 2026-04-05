# Script Setup Order Standard

Use this order in Vue and Nuxt components with `<script setup>`.

## Required Order

1. Imports
2. Local types
3. Props and emits and models
4. External composables
5. Local state
6. Actions
7. Handlers
8. Watches
9. Lifecycle
10. Other items

## Local State Grouping

Group local state by type and keep naming descriptive.

- Strings
- Numbers
- Booleans
- Arrays
- Objects

## Rules

- Keep related code together.
- Do not place business logic in watchers unless reactive side effects are required.
- Use small action helpers to keep intent obvious.
- Use reactive props destructuring.
- Use `defineModel` for `v-model` contracts.

## Quick Example

```ts
// Imports
import { computed, ref, watch } from "vue";

// Local types
type FormState = {
  name: string;
};

// Props and emits and models
const { title = "Default" } = defineProps<{ title?: string }>();
const isOpen = defineModel<boolean>("open", { required: true });

// External composables
const toast = useAppToast();

// Local state
const statusText = ref("");
const isSaving = ref(false);
const tags = ref<string[]>([]);
const form = ref<FormState>({ name: "" });

// Actions
const resetForm = () => {
  form.value = { name: "" };
};

// Handlers
const handleSave = async () => {
  isSaving.value = true;
  statusText.value = "Saving...";
  try {
    // save
  } finally {
    isSaving.value = false;
  }
};

// Watches
watch(isOpen, (open) => {
  if (!open) resetForm();
});

// Lifecycle
onMounted(() => {
  statusText.value = "Ready";
});

// Other items
const canSave = computed(() => form.value.name.trim().length > 0);
```
