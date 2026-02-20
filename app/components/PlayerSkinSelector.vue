<template>
  <div class="flex flex-col gap-4">
    <!-- Header/Stats -->
    <div class="flex items-center justify-between text-xs">
      <span class="text-muted">{{ modelValue.length }} selected</span>
      <span class="text-muted">{{ skins.length - modelValue.length }} available</span>
    </div>

    <!-- Scrollable Grid -->
    <TransitionGroup
      name="skin-list"
      tag="div"
      class="border-muted bg-muted/20 grid max-h-[400px] w-full grid-cols-2 gap-3 overflow-y-auto rounded-lg border p-2 pr-1 sm:grid-cols-2"
    >
      <div
        v-for="skin in sortedSkins"
        :key="skin._id"
        class="group border-muted/50 hover:border-primary/50 relative flex cursor-pointer flex-col overflow-hidden rounded-md border bg-black transition-colors"
        @click="toggleSelection(skin._id)"
      >
        <!-- Selection Indicator -->
        <div class="absolute top-2 right-2 z-20">
          <div
            class="flex size-6 items-center justify-center rounded-full border transition-all duration-200"
            :class="[
              isSelected(skin._id)
                ? 'bg-primary border-primary text-white'
                : 'border-white/50 bg-black/50 hover:bg-black/70',
            ]"
          >
            <UIcon v-if="isSelected(skin._id)" name="heroicons:check" class="size-4" />
          </div>
        </div>

        <!-- Image Slider (Mini) -->
        <div
          class="pointer-events-none relative aspect-video w-full opacity-80 transition-opacity group-hover:opacity-100"
        >
          <!-- Using ImageSlider but disabling interactions to prevent conflict with card click -->
          <img :src="skin.preview_images[0]" class="size-full object-cover" />
          <div
            v-if="isSelected(skin._id)"
            class="bg-primary/10 absolute inset-0 mix-blend-overlay"
          />
        </div>

        <!-- Info -->
        <div class="flex flex-col p-2">
          <span
            class="truncate text-sm font-medium"
            :class="isSelected(skin._id) ? 'text-primary' : 'text-toned'"
            >{{ skin.name }}</span
          >
          <span class="text-muted truncate text-xs">{{ skin.author }}</span>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
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

// ------ Computed ------
const sortedSkins = computed(() => {
  // Create shallow copy to sort
  return [...props.skins].sort((a, b) => {
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

<style scoped>
.skin-list-move,
.skin-list-enter-active,
.skin-list-leave-active {
  transition: all 0.3s ease;
}

.skin-list-enter-from,
.skin-list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.skin-list-leave-active {
  position: absolute;
}
</style>
