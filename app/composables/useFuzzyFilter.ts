import type { MaybeRefOrGetter } from "vue";
import { toValue } from "vue";
import Fuse from "fuse.js";
import type { FuseOptionKey } from "fuse.js";

type UseFuzzyFilterOptions<T> = {
  keys: ReadonlyArray<FuseOptionKey<T>>;
  threshold?: number;
};

export function useFuzzyFilter<T>(
  items: MaybeRefOrGetter<readonly T[]>,
  query: MaybeRefOrGetter<string>,
  options: UseFuzzyFilterOptions<T>,
) {
  return computed(() => {
    const currentItems = toValue(items);
    const currentQuery = toValue(query).trim();

    if (!currentQuery) return [...currentItems];

    const fuse = new Fuse([...currentItems], {
      keys: [...options.keys],
      threshold: options.threshold ?? 0.3,
    });

    return fuse.search(currentQuery).map((result) => result.item);
  });
}
