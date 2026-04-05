<template>
  <div class="flex w-full flex-col gap-2">
    <!-- Search -->
    <UInput
      v-model="searchQuery"
      :icon="ICONS.SEARCH"
      placeholder="Search skins..."
      :ui="{ trailing: 'pe-1' }"
    >
      <template v-if="searchQuery" #trailing>
        <UButton color="neutral" variant="link" :icon="ICONS.CLOSE" @click="searchQuery = ''" />
      </template>
    </UInput>

    <!-- Stats -->
    <div class="text-muted flex justify-end gap-3 text-xs">
      <span>{{ modelValue.length }} selected</span>
      <span>{{ skins.length - modelValue.length }} available</span>
    </div>

    <!-- Scrollable list -->
    <div
      class="border-muted bg-elevated flex max-h-80 w-full flex-col overflow-y-auto rounded-lg border"
    >
      <!-- Selected group -->
      <template v-if="!searchQuery && selectedSkins.length">
        <p
          class="text-muted sticky top-0 bg-inherit px-2.5 py-1 text-xs font-medium tracking-wide uppercase"
        >
          Selected
        </p>
        <DashboardSkinSelectorItem
          v-for="skin in selectedSkins"
          :key="skin._id"
          :skin="skin"
          :selected="true"
          @toggle="toggleSelection(skin._id)"
          @edit="
            quickEditSkin = skin;
            isQuickEditOpen = true;
          "
        />
      </template>

      <!-- Available group -->
      <template v-if="!searchQuery && availableSkins.length">
        <p
          class="text-muted sticky top-0 bg-inherit px-2.5 py-1 text-xs font-medium tracking-wide uppercase"
        >
          Available
        </p>
      </template>

      <DashboardSkinSelectorItem
        v-for="skin in displayedSkins"
        :key="skin._id"
        :skin="skin"
        :selected="isSelected(skin._id)"
        @toggle="toggleSelection(skin._id)"
        @edit="
          quickEditSkin = skin;
          isQuickEditOpen = true;
        "
      />

      <p
        v-if="!displayedSkins.length && !selectedSkins.length"
        class="text-muted px-2.5 py-4 text-center text-sm"
      >
        No skins found.
      </p>
    </div>

    <!-- Quick Edit Modal -->
    <DashboardSkinQuickEditModal
      v-if="quickEditSkin"
      v-model:open="isQuickEditOpen"
      :skin="quickEditSkin"
    />
  </div>
</template>

<script lang="ts" setup>
import Fuse from "fuse.js";
import type { Doc, Id } from "~~/convex/_generated/dataModel";
import { ICONS } from "~/types/icons";

// ------ Local Types ------
type Skin = Doc<"skins">;

// ------ Props & Emits ------
const modelValue = defineModel<Id<"skins">[]>({ default: () => [] });
const { skins } = defineProps<{ skins: Skin[] }>();

// ------ Local State ------
const searchQuery = ref("");
const quickEditSkin = ref<Skin | null>(null);
const isQuickEditOpen = ref(false);

// ------ Computed ------
const isSelected = (id: Id<"skins">) => modelValue.value.includes(id);

const selectedSkins = computed(() => skins.filter((s) => isSelected(s._id)));

const availableSkins = computed(() => skins.filter((s) => !isSelected(s._id)));

const filteredAvailable = computed(() => {
  if (!searchQuery.value.trim()) return availableSkins.value;
  const fuse = new Fuse(skins, { keys: ["name", "author"] as (keyof Skin)[], threshold: 0.4 });
  return fuse
    .search(searchQuery.value)
    .map((r) => r.item)
    .filter((s) => !isSelected(s._id));
});

// During search: show all matching items (selected + available). Without search: only available (selected shown above)
const displayedSkins = computed(() =>
  searchQuery.value ? filteredAvailable.value : availableSkins.value,
);

// ------ Actions ------
function toggleSelection(id: Id<"skins">) {
  const next = [...modelValue.value];
  const idx = next.indexOf(id);
  if (idx === -1) next.push(id);
  else next.splice(idx, 1);
  modelValue.value = next;
}
</script>
