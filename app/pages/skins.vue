<template>
  <div class="flex w-full flex-col items-center">
    <section class="flex w-full max-w-5xl flex-col gap-2 p-2">
      <div class="flex w-full items-end justify-between">
        <UInput
          v-model="inputSearch"
          placeholder="Search skins..."
          :icon="ICONS.SEARCH"
          class="search-input-default-size"
        />
        <p v-if="skinsList?.length" class="text-muted text-sm">
          Loaded {{ skinsList.length }} skins
        </p>
        <p v-else class="text-muted text-sm">Loading skins...</p>
      </div>

      <div
        v-if="isLoadingSkins"
        class="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
      >
        <SkinCard v-for="n in 16" :key="n" loading />
      </div>

      <div
        v-else-if="filteredSkins.length"
        class="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
      >
        <SkinCard
          v-for="skin in filteredSkins"
          :key="skin._id"
          :skin="skin"
          :disabled="!isSignedIn"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";
import { useSorted } from "@vueuse/core";
import Fuse from "fuse.js";

const { isSignedIn } = useAuth();

// ------ External Composables ------
const { data: skinsList, isPending: isLoadingSkins } = useConvexQuery(api.skins.listSkins);

// ------ Local State ------
const inputSearch = ref("");

// ------ Computed ------
const sortedSkins = useSorted(
  () => skinsList.value || [],
  (a, b) => a.name.localeCompare(b.name),
);

const filteredSkins = computed(() => {
  if (!inputSearch.value) return sortedSkins.value;

  const fuse = new Fuse(sortedSkins.value, {
    keys: ["name", "author"],
    threshold: 0.3,
  });

  return fuse.search(inputSearch.value).map((result) => result.item);
});
</script>

<style></style>
