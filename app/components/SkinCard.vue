<template>
  <UContextMenu :items="menuItems" :disabled="isContextDisabledComputed">
    <!-- Loaded State -->
    <div v-if="skin && !loading" class="bg-muted relative w-full overflow-hidden rounded-lg">
      <ImageSlider :images="skin.preview_images" />
      <!-- Download Button -->
      <UButton
        :icon="ICONS.DOWNLOAD"
        :href="skin.download_url"
        target="_blank"
        @click="handleDownload"
        variant="soft"
        color="neutral2"
        class="absolute top-1 right-1 transition-opacity duration-150"
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
              <p>{{ skin.name }} by {{ skin.author }}</p>
            </span>
          </template>
        </UPopover>

        <USeparator color="neutral" class="mt-1 mb-2 brightness-150" />

        <!-- Extra Info -->
        <div class="flex">
          <!-- Download Count -->
          <UPopover mode="hover" :content="{ align: 'start' }">
            <a
              :href="skin.download_url"
              target="_blank"
              class="isHovering flex w-fit cursor-help items-center justify-center gap-1 select-none"
            >
              <UIcon :name="ICONS.DOWNLOAD" />
              <p class="text-muted text-xs">{{ skin.download_count }}</p>
            </a>

            <template #content>
              <span class="popover-content">
                <p>{{ skin.download_count }} downloads</p>
              </span>
            </template>
          </UPopover>

          <!-- Creation Time -->
          <UPopover mode="hover" :content="{ align: 'end' }">
            <span class="isHovering text-muted ml-auto cursor-help text-xs select-none">
              {{ formatTimeAgo(new Date(skin._creationTime)) }}
            </span>
            <template #content>
              <span class="popover-content">
                <p>{{ new Date(skin._creationTime).toLocaleString() }}</p>
              </span>
            </template>
          </UPopover>
        </div>
      </div>
    </div>

    <!-- Skeleton State -->
    <div v-else class="bg-muted relative w-full animate-pulse overflow-hidden rounded-lg">
      <div class="relative mb-1 flex aspect-video w-full max-w-3xl"></div>

      <!-- Information Section -->
      <div class="text-toned flex flex-col px-2 pb-2">
        <!-- Skin Title -->
        <span class="flex size-fit max-w-full cursor-help">
          <p class="truncate text-lg font-medium">&nbsp;</p>
        </span>

        <USeparator color="neutral" class="mt-1 mb-2 brightness-150" />

        <!-- Extra Info -->
        <div class="flex">
          <!-- Download Count -->
          <a target="_blank" class="flex w-fit items-center justify-center gap-1 select-none">
            <p class="text-muted text-xs">&nbsp;</p>
          </a>

          <!-- Creation Time -->
          <span class="text-muted ml-auto text-xs select-none">&nbsp;</span>
        </div>
      </div>
    </div>
    <ModalsEditSkin v-if="skin" :skin="skin" v-model:open="isModalOpen" />
  </UContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuItem } from "@nuxt/ui";
import { formatTimeAgo } from "@vueuse/core";
import { TOAST } from "~/types/constants";
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";
import type { Doc } from "~~/convex/_generated/dataModel";

// ------ Local Types & Defaults ------
type Skin = Doc<"skins">;

// ------ Props & Emits ------
const props = defineProps<{
  skin?: Skin;
  disabled?: boolean;
  loading?: boolean;
}>();

// ------ External Composables ------
const toast = useToast();
const { isSignedIn } = useAuth();
const { mutate: deleteSkin } = useConvexMutation(api.skins.deleteSkin);
const { mutate: updateSkin } = useConvexMutation(api.skins.updateSkin);

// ------ Local State ------
const isLoading = ref(false);
const isModalOpen = ref(false);

// ------ Computed ------
const isContextDisabledComputed = computed(() => {
  // 1. If loading or no skin, disable context menu
  if (props.loading || !props.skin) return true;

  // 2. If the prop was explicitly passed (it's not undefined), prioritize it.
  // We check undefined because 'false' is a valid value we want to respect.
  if (props.disabled !== undefined) {
    return props.disabled;
  }

  // 3. Otherwise (prop not passed), use default logic:
  // Disabled by default (true), unless signed in (false).
  return !isSignedIn.value;
});

const menuItems = computed(() => {
  const items: ContextMenuItem[] = [];

  // Cannot perform actions if loading or no skin
  if (props.loading || !props.skin) return items;

  // Just for security. The buttons won't show if the user isn't signed in anyway
  // But this ensures that even if somehow they can see the buttons, they won't work unless they're signed in.
  if (isSignedIn.value) {
    items.push(
      {
        label: "Edit Skin",
        icon: ICONS.EDIT,
        color: "info",
        onSelect: openEditModal,
      },
      {
        label: "Delete Skin",
        icon: ICONS.DELETE,
        color: "error",
        onSelect: handleSkinDeletion,
      },
    );
  }
  return items;
});

// ------ Actions ------
function openEditModal() {
  if (props.loading || !props.skin) return;
  isModalOpen.value = true;
}

// ------ Handlers ------
async function handleSkinDeletion() {
  if (!props.skin) return;

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

async function handleDownload() {
  if (!props.skin) return;

  try {
    isLoading.value = true;

    updateSkin({
      _id: props.skin._id,
      download_count: props.skin.download_count + 1,
    });
  } catch (error) {
    console.error("Failed to update the download count.");
  } finally {
    isLoading.value = false;
  }
}
</script>
