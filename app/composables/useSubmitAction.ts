export interface SubmitActionOptions {
  successTitle?: string;
  successDescription?: string;
  errorTitle?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useSubmitAction = () => {
  const toast = useAppToast();
  const statusMessage = ref("");
  const isLoading = computed(() => !!statusMessage.value);

  const handleSubmit = async (
    action: () => Promise<void | boolean>, // Allow return boolean (e.g. for early exit checks)
    options: SubmitActionOptions = {},
  ) => {
    try {
      // Execute the action
      const result = await action();

      // If the action returns explicit false (not undefined), consider it a "handled" exit (no success/error toast needed usually, or handled inside)
      // For this implementation, let's assume if it returns nothing or true, it succeeded.
      // If the user manually resets statusMessage inside action to empty string logic flow might be weird,
      // but usually we rely on finally to clear it.

      // If we provided success options, show toast
      if (options.successTitle) {
        toast.success({
          title: options.successTitle,
          description: options.successDescription,
        });
      }

      options.onSuccess?.();
    } catch (error) {
      console.error("Action failed:", error);

      const title = options.errorTitle || "An unexpected error occurred.";
      const description = (error as Error).message || String(error);

      toast.error({
        title,
        description,
      });

      options.onError?.(error);
    } finally {
      statusMessage.value = "";
    }
  };

  return {
    statusMessage,
    isLoading,
    handleSubmit,
  };
};
