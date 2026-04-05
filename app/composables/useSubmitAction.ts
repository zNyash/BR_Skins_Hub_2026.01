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
      const result = await action();

      // Explicit false means the action handled the flow and no success callback/toast should run.
      if (result === false) return;

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
