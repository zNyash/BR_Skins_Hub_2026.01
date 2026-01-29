<template>
  <UContextMenu :items="menuItems">
    <div class="bg-muted group/card relative w-full overflow-hidden rounded-lg">
      <ImageSlider :images="skin.preview_images" />
      <!-- Download Button -->
      <UButton
        :icon="ICONS.DOWNLOAD"
        :href="skin.download_url"
        variant="soft"
        color="neutral2"
        class="absolute top-1 right-1 opacity-0 transition-opacity duration-150 group-hover/card:opacity-100"
      />

      <!-- Information Section -->
      <div class="text-toned flex flex-col px-2 pb-2">
        <!-- Skin Title -->
        <UPopover mode="hover" :content="{ align: 'start' }">
          <span class="isHovering flex size-fit max-w-full cursor-help">
            <p class="truncate text-lg font-medium">{{ skin.name }}</p>
          </span>

          <template #content>
            <span class="popover-content">
              <p>{{ skin.name }}</p>
            </span>
          </template>
        </UPopover>
        <USeparator color="neutral" class="mt-1 mb-2 brightness-150" />
        <!-- Extra Info -->
        <div class="flex">
          <UPopover mode="hover" :content="{ align: 'start' }">
            <span
              class="isHovering flex w-fit cursor-help items-center justify-center gap-1 select-none"
            >
              <UIcon :name="ICONS.DOWNLOAD" />
              <p class="text-muted text-xs">{{ skin.download_count }}</p>
            </span>

            <template #content>
              <span class="popover-content">
                <p>{{ skin.download_count }} downloads</p>
              </span>
            </template>
          </UPopover>

          <UPopover mode="hover" :content="{ align: 'end' }">
            <span class="isHovering text-muted ml-auto cursor-help text-xs select-none">
              {{ formatTimeAgo(new Date(skin._creationTime)) }}
            </span>
            <template #content>
              <span class="popover-content">
                <p>{{ formatTimeAgo(new Date(skin._creationTime)) }}</p>
              </span>
            </template>
          </UPopover>
        </div>
      </div>
    </div>
    <ModalsEditSkin :skin="skin" v-model:is-modal-open="isModalOpen" />
  </UContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuItem } from "@nuxt/ui";
import { formatTimeAgo } from "@vueuse/core";
import { TOAST } from "~/types/constants";
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";
import type { Doc } from "~~/convex/_generated/dataModel";

// ------ Types ------
type Skin = Doc<"skins">;

// ----- Props ------
const props = defineProps<{
  skin: Skin;
}>();

// ------ Context Menu Items ------
const menuItems = ref<ContextMenuItem[]>([
  {
    label: "Edit Skin",
    icon: ICONS.BUTTONS.EDIT,
    color: "info",
    onSelect: handleEditSkin,
  },
  {
    label: "Delete Skin",
    icon: ICONS.BUTTONS.DELETE,
    color: "error",
    onSelect: handleSkinDeletion,
  },
]);

// ------ State ------
const isLoading = ref(false);
const isModalOpen = ref(false);
const toast = useToast();

function handleEditSkin() {
  isModalOpen.value = true;
}

const { mutate: deleteSkin } = useConvexMutation(api.skins.deleteSkin);
async function handleSkinDeletion() {
  try {
    isLoading.value = true;

    // Delete skin from database
    await deleteSkin({
      _id: props.skin._id,
    });

    // Cleanup uploaded images from UploadThing for this skin
    await $fetch("/api/uploadthing/delete-files", {
      method: "POST",
      body: props.skin.preview_images,
    });

    toast.add({
      icon: ICONS.SUCCESS,
      title: "Skin Deleted",
      description: `The skin "${props.skin.name}" has been deleted successfully.`,
      color: "success",
      duration: TOAST.DURATION.SUCCESS,
    });
  } catch (error) {
    console.error("Error deleting skin:", error);
  } finally {
    isLoading.value = false;
  }
}
</script>
