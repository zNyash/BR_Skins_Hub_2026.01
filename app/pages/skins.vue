<template>
  <div class="flex w-full flex-col items-center">
    <section class="flex w-full max-w-2xl flex-col items-center gap-4">
      <div class="flex w-full">
        <UInput
          v-model="inputSearch"
          placeholder="Search skins..."
          :icon="ICONS.SEARCH"
          class="search-input-default-size"
        />
      </div>

      <div class="grid w-full grid-cols-2 gap-2">
        <LoadingPage :isLoading="isLoadingSkins" />

        <SkinCard v-for="skin in filteredSkins" :key="skin._id" :skin="skin" />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";
import { useSorted } from "@vueuse/core";
import Fuse from "fuse.js";

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
