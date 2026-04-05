import type { MaybeRefOrGetter } from "vue";
import { toValue } from "vue";

type PendingAction = () => void;

export function useDiscardGuard(isDirty: MaybeRefOrGetter<boolean>) {
  const isOpen = ref(false);
  const pendingAction = ref<PendingAction | null>(null);

  function guard(action: PendingAction) {
    if (toValue(isDirty)) {
      pendingAction.value = action;
      isOpen.value = true;
      return;
    }

    action();
  }

  function close() {
    isOpen.value = false;
  }

  function clearPending() {
    pendingAction.value = null;
  }

  function consumePending() {
    const nextAction = pendingAction.value;
    pendingAction.value = null;
    return nextAction;
  }

  return {
    isOpen,
    pendingAction,
    guard,
    close,
    clearPending,
    consumePending,
  };
}
