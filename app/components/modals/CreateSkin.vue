<template>
  <UModal title="Add New Skin" v-model:open="isModalOpen" :close="false">
    <UButton :icon="ICONS.BUTTONS.ADD">Add Skin</UButton>

    <template #body>
      <div class="flex flex-col gap-2">
        <span class="flex flex-col">
          <p class="text-toned text-xs">Name<span class="text-error">*</span></p>
          <UInput v-model="formState.name" required placeholder="Some skin name" />
        </span>
        <span class="flex flex-col">
          <p class="text-toned text-xs">Author<span class="text-error">*</span></p>
          <UInput v-model="formState.author" required placeholder="Author name" />
        </span>
        <span class="flex flex-col">
          <p class="text-toned text-xs">Download URL<span class="text-error">*</span></p>
          <UInput
            v-model="formState.download_url"
            required
            placeholder="https://example.com/skin-download"
          />
        </span>
        <span class="flex flex-col">
          <p class="text-toned mb-0.5 text-xs">Preview Images</p>
          <ImageDropzone v-model="rawFiles" accept="image/png, image/jpeg" />
          <p class="text-toned mt-1 ml-auto text-xs">{{ loadingText }}</p>
        </span>
        <span class="mt-2 flex w-full justify-end gap-2">
          <UButton variant="soft" color="neutral" @click="handleCancel">Cancel</UButton>
          <UButton
            variant="solid"
            color="primary"
            @click="handleSkinCreation"
            :loading="isUploadingSkin"
            >Create Skin</UButton
          >
        </span>
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
const loadingText = ref("");

// ------ Helpers ------
const resetForm = () => {
  formState.value = { ...getFormDefaults() };
  rawFiles.value = [];
  resetLoadingText();
};
const closeModal = () => {
  isModalOpen.value = false;
};
const resetLoadingText = () => {
  loadingText.value = "";
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

    loadingText.value = "Uploading Images";
    const imageUrls = await uploadSkinImages(rawFiles.value);

    loadingText.value = "Checking response";
    if (imageUrls.length === 0) {
      toast.warning({
        title: "No preview images uploaded.",
        description: "Please upload at least one preview image for the skin.",
      });

      resetLoadingText();
      return;
    }

    loadingText.value = "Creating Skin";
    await createSkin({
      ...formState.value,
      preview_images: imageUrls,
    });

    loadingText.value = "Skin Created";
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
    isUploadingSkin.value = false;
  }
};

const handleCancel = () => {
  closeModal();
  resetForm();
};
</script>

<style></style>
