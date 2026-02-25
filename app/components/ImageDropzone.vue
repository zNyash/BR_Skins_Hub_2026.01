<template>
  <div class="flex flex-col gap-3">
    <!-- Drop Zone -->
    <div
      @dragover.prevent="activeState"
      @dragleave.prevent="resetState"
      @drop.prevent="handleImageDrop"
      class="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200 ease-in-out"
      :class="[isDraggingOver ? 'border-primary bg-primary/10' : 'border-muted hover:bg-muted/25']"
    >
      <label
        for="file-input"
        class="flex size-full cursor-pointer flex-col items-center justify-center gap-3 text-center"
      >
        <div class="text-muted flex items-center justify-center">
          <UIcon name="i-heroicons-photo" class="size-8" />
        </div>
        <div class="">
          <p class="text-sm font-semibold">Click to select or drag and drop!</p>
          <p class="text-muted text-xs">Accepted formats: {{ acceptedImageTypeLabel }}</p>
        </div>
      </label>
      <input
        id="file-input"
        ref="file-input"
        type="file"
        multiple
        :accept="accept"
        class="hidden"
        @change="handleFileSelection"
      />
    </div>

    <!-- Image Grid -->
    <div v-if="modelValue.length > 0" class="space-y-1">
      <div class="flex items-center">
        <h3 class="text-toned text-sm font-medium">Attached Images ({{ modelValue.length }})</h3>
      </div>

      <!-- Image Grid -->
      <TransitionGroup tag="div" name="image-grid" class="grid grid-cols-4 gap-2">
        <div
          v-for="(file, index) in modelValue"
          :key="getFileKey(file)"
          class="group ring-muted relative aspect-square overflow-hidden rounded-lg ring-1"
        >
          <img
            :src="getPreviewUrl(file)"
            :alt="file.name"
            class="h-full w-full object-cover"
            draggable="false"
          />

          <!-- Overlay -->
          <div
            class="absolute inset-0 flex translate-y-full flex-col bg-linear-to-t from-black/80 to-transparent opacity-0 transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <!-- Actions -->
            <div class="z-10 ml-auto flex p-1">
              <UButton
                :icon="ICONS.BUTTONS.DELETE"
                variant="solid"
                color="neutral"
                size="xs"
                @click.stop="removeFileAt(index)"
              />
            </div>

            <!-- File Info -->
            <div class="mt-auto flex w-full truncate p-1 select-none">
              <p class="text-toned text-xs">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";

// ------ Local Types & Defaults ------
interface Props {
  accept?: string;
}

// ------ Props & Emits ------
const modelValue = defineModel<File[]>({ default: () => [] });
const { accept = "image/*" } = defineProps<Props>();

// ------ External Composables ------
const { isDraggingOver, activeState, resetState } = useDragDropState();
const { getPreviewUrl, clearPreview } = useImagePreviews();
const { getFileKey, formatFileSize } = useFileHelpers();

// ------ Computed ------
const acceptedImageTypeLabel = computed(() =>
  accept
    ? accept
        .replace(/image\//g, "")
        .toUpperCase()
        .split(",")
        .join(", ")
    : "Images",
);

// ------ Actions ------
const appendSelectedFiles = (files: File[]) => {
  if (files.length === 0) return;

  modelValue.value = [...modelValue.value, ...files];
};

const removeFileAt = (index: number) => {
  const fileToRemove = modelValue.value[index];
  if (fileToRemove) clearPreview(fileToRemove);

  const newFiles = [...modelValue.value];
  newFiles.splice(index, 1);
  modelValue.value = newFiles;
};

// ------ Handlers ------
const handleImageDrop = (event: DragEvent) => {
  resetState();
  const droppedFiles = event.dataTransfer?.files;
  if (!droppedFiles) return;

  appendSelectedFiles(Array.from(droppedFiles));
};

const handleFileSelection = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  appendSelectedFiles(Array.from(input.files));
  input.value = "";
};
</script>

<style scoped>
.image-grid-enter-active,
.image-grid-leave-active {
  transition: all 0.15s ease;
}
.image-grid-enter-from,
.image-grid-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
