# Toast and Loading Consistency

Use this standard for async user flows and admin actions.

## Loading States

- Every async action should have a visible loading state.
- Loading text should describe the current step.
- Keep status updates explicit for multi-step flows.

Examples of good status text:

- "Validating input..."
- "Uploading images..."
- "Saving player..."
- "Refreshing list..."

## Toast Consistency

- Keep success and error toast tone consistent across pages.
- Prefer action-oriented titles and concise descriptions.
- Do not show duplicate success toasts for a single action.
- Surface actionable errors when possible.

## Submission Pattern

When appropriate, use `useSubmitAction` and keep explicit status updates.

```ts
const { handleSubmit, statusMessage } = useSubmitAction();

const handleSave = () =>
  handleSubmit(
    async () => {
      statusMessage.value = "Validating...";
      if (!isValid.value) return false;

      statusMessage.value = "Saving data...";
      await saveMutation({ ...payload });
    },
    { successTitle: "Saved" },
  );
```

## Review Checks

- Confirm loading UI appears for slow operations.
- Confirm status text reflects real progress.
- Confirm toast wording is consistent with existing patterns.
- Confirm error toasts appear for failed operations.
