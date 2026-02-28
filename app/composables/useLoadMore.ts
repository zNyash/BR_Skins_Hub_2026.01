export function useLoadMore<T>(
  items: Ref<T[]>,
  options: {
    pageSize?: number;
    resetTrigger?: Ref<unknown>;
  } = {},
) {
  const pageSize = options.pageSize || 16;

  // ------ Local State ------
  const limit = ref(pageSize);

  // ------ Computed ------
  const visibleItems = computed(() => {
    return items.value?.slice(0, limit.value) || [];
  });

  const canLoadMore = computed(() => {
    return (items.value?.length || 0) > limit.value;
  });

  // ------ Actions ------
  const loadMore = () => {
    limit.value += pageSize;
  };

  const reset = () => {
    limit.value = pageSize;
  };

  // ------ Watchers ------
  if (options.resetTrigger) {
    watch(options.resetTrigger, reset);
  }

  return {
    visibleItems,
    canLoadMore,
    loadMore,
    reset,
    limit,
  };
}
