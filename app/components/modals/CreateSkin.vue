<template>
  <UModal title="Add New Skin" v-model:open="isModalOpen" :close="false">
    <UButton :icon="ICONS.BUTTONS.ADD">Add Skin</UButton>

    <template #body>
      <div class="flex w-full flex-col gap-2">
        <NFormField label="Name" required class="w-full">
          <UInput v-model="formState.name" required placeholder="Some skin name" class="w-full" />
        </NFormField>
        <NFormField label="Author" required class="w-full">
          <UInput v-model="formState.author" required placeholder="Author name" class="w-full" />
        </NFormField>
        <NFormField label="Download URL" required class="w-full">
          <UInput
            v-model="formState.download_url"
            required
            placeholder="https://example.com/skin-download"
            class="w-full"
          />
        </NFormField>
        <NFormField label="Preview Images" required class="w-full">
          <ImageDropzone v-model="rawFiles" accept="image/png, image/jpeg" class="w-full" />
        </NFormField>

        <NSaveCancel
          :loading-text="loadingState"
          @save="handleSkinCreation"
          @cancel="handleCancel"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";

// ------ Defaults ------
const getFormDefaults = () => ({
  name: "",
  author: "",
  download_url: "",
  preview_images: [""],
});

const { mutate: createSkin } = useConvexMutation(api.skins.createSkin);
const toast = useAppToast();

// ------ State ------
const formState = ref({ ...getFormDefaults() });
const rawFiles = ref<File[]>([]);
const isModalOpen = ref(false);
const isUploadingSkin = ref(false);
const loadingState = ref("");

// ------ Helpers ------
const resetForm = () => {
  formState.value = { ...getFormDefaults() };
  rawFiles.value = [];
  resetLoadingState();
};
const closeModal = () => {
  isModalOpen.value = false;
};
const resetLoadingState = () => {
  loadingState.value = "";
};

// ------ Watchers ------
watch(
  () => isModalOpen.value,
  (newVal) => {
    if (!newVal) {
      resetForm();
    }
  },
);

// ------ Handlers ------
const handleSkinCreation = async () => {
  try {
    isUploadingSkin.value = true;

    loadingState.value = "Uploading Images...";
    const imageUrls = await uploadSkinImages(rawFiles.value);

    loadingState.value = "Checking response...";
    if (imageUrls.length === 0) {
      toast.warning({
        title: "No preview images uploaded.",
        description: "Please upload at least one preview image for the skin.",
      });

      resetLoadingState();
      return;
    }

    loadingState.value = "Creating Skin...";
    await createSkin({
      ...formState.value,
      preview_images: imageUrls,
    });

    toast.success({
      title: `Created skin "${formState.value.name}" successfully!`,
    });
    resetForm();
    closeModal();
  } catch (error) {
    console.error("Error creating skin:", error);
    toast.error({
      title: "Error creating skin.",
      description: "An error occurred while creating the skin. Please try again.",
    });
  } finally {
    loadingState.value = "";
  }
};

const handleCancel = () => {
  closeModal();
  resetForm();
};
</script>

<style></style>
