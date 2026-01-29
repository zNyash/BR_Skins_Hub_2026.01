export const useResettableRef = <T>(factory: () => T) => {
  const state = ref<T>(factory()) as Ref<T>;

  const reset = () => {
    state.value = factory();
  };

  return {
    state,
    reset,
  };
};
