<template>
  <div
    class="hover:bg-default flex items-center gap-2 px-2.5 py-1.5 transition-colors"
    :class="{ 'opacity-60': !selected }"
  >
    <!-- Checkbox -->
    <button
      class="flex size-4 shrink-0 items-center justify-center rounded border transition-colors"
      :class="selected ? 'bg-primary border-primary text-white' : 'border-muted'"
      @click="emit('toggle')"
    >
      <UIcon v-if="selected" name="heroicons:check" class="size-3" />
    </button>

    <!-- Thumbnail -->
    <img
      v-if="skin.preview_images[0]"
      :src="skin.preview_images[0]"
      :alt="skin.name"
      class="size-8 shrink-0 cursor-pointer rounded object-cover"
      @click="emit('toggle')"
    />
    <div v-else class="bg-muted size-8 shrink-0 rounded" />

    <!-- Name -->
    <span
      class="flex-1 cursor-pointer truncate text-sm"
      :class="selected ? 'text-primary font-medium' : 'text-toned'"
      @click="emit('toggle')"
    >
      {{ skin.name }}
    </span>

    <!-- Edit icon -->
    <UButton
      :icon="ICONS.EDIT"
      size="xs"
      color="neutral"
      variant="ghost"
      @click.stop="emit('edit')"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Doc } from "~~/convex/_generated/dataModel";
import { ICONS } from "~/types/icons";

// ------ Props & Emits ------
const { skin, selected } = defineProps<{
  skin: Doc<"skins">;
  selected: boolean;
}>();
const emit = defineEmits<{
  (e: "toggle"): void;
  (e: "edit"): void;
}>();
</script>
