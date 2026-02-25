<template>
  <div class="flex flex-col gap-2">
    <!-- Search Bar -->
    <UInput
      v-model="searchQuery"
      :icon="ICONS.SEARCH"
      placeholder="Search skins..."
      size="sm"
      :ui="{ trailing: 'pe-1' }"
    >
      <template v-if="searchQuery.length" #trailing>
        <UButton
          size="sm"
          color="neutral"
          variant="link"
          :icon="ICONS.CLOSE"
          @click="searchQuery = ''"
        />
      </template>
    </UInput>

    <!-- Header/Stats -->
    <div class="flex items-center justify-between text-xs">
      <span class="text-muted">{{ modelValue.length }} selected</span>
      <span class="text-muted">{{ skins.length - modelValue.length }} available</span>
    </div>

    <!-- Scrollable Grid -->
    <div
      class="border-muted bg-elevated grid max-h-100 w-full grid-cols-2 gap-1 overflow-y-auto rounded-lg border p-1.5"
    >
      <div
        v-for="skin in sortedSkins"
        :key="skin._id"
        class="group border-muted/50 hover:border-primary/50 bg-default relative flex flex-col overflow-hidden rounded-md border transition-colors"
      >
        <!-- Selection Indicator -->
        <div class="pointer-events-none absolute top-1 right-1 z-20">
          <div
            class="flex size-4 items-center justify-center rounded-full border transition-all duration-200"
            :class="[
              isSelected(skin._id)
                ? 'bg-primary border-primary text-white'
                : 'border-white/50 bg-black/50 hover:bg-black/70',
            ]"
          >
            <UIcon v-if="isSelected(skin._id)" name="heroicons:check" class="size-4" />
          </div>
        </div>

        <!-- Image Preview -->
        <div
          class="relative aspect-video w-full cursor-pointer opacity-80 transition-opacity group-hover:opacity-100"
          @click="toggleSelection(skin._id)"
        >
          <!-- Using ImageSlider but disabling interactions to prevent conflict with card click -->
          <ImageSlider :images="skin.preview_images" />
        </div>

        <!-- Info -->
        <div class="flex flex-col px-2 py-1">
          <span
            class="truncate text-sm font-medium"
            :class="isSelected(skin._id) ? 'text-primary' : 'text-toned'"
            >{{ skin.name }}</span
          >
          <span class="text-muted truncate text-xs">{{ skin.author }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";
import type { Id, Doc } from "~~/convex/_generated/dataModel";

// ------ Local Types & Defaults ------
type Skin = Doc<"skins">;

// ------ Props & Emits ------
const props = defineProps<{
  skins: Skin[];
  modelValue: Id<"skins">[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Id<"skins">[]): void;
}>();

// ------ Local State ------
const searchQuery = ref("");

// ------ Computed ------
const filteredSkins = computed(() => {
  if (!searchQuery.value.trim()) return props.skins;

  // Split query into terms (e.g. "aris nsh" -> ["aris", "nsh"])
  const terms = searchQuery.value
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  return props.skins.filter((s) => {
    const searchTarget = `${s.name} ${s.author || ""}`.toLowerCase();
    // Check if EVERY term exists somewhere in the combined name+author string
    return terms.every((term) => searchTarget.includes(term));
  });
});

const sortedSkins = computed(() => {
  // Create shallow copy to sort
  return [...filteredSkins.value].sort((a, b) => {
    const aSelected = isSelected(a._id);
    const bSelected = isSelected(b._id);

    if (aSelected === bSelected) {
      // Secondary sort by name if selection status is same
      return a.name.localeCompare(b.name);
    }
    // Selected items come first
    return aSelected ? -1 : 1;
  });
});

// ------ Actions ------
const isSelected = (id: Id<"skins">) => props.modelValue.includes(id);

const toggleSelection = (id: Id<"skins">) => {
  const newSelection = [...props.modelValue];
  const index = newSelection.indexOf(id);

  if (index === -1) {
    newSelection.push(id);
  } else {
    newSelection.splice(index, 1);
  }

  emit("update:modelValue", newSelection);
};
</script>
