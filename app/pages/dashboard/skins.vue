<template>
  <div class="mx-auto flex max-w-lg flex-col items-center">
    <div class="flex w-full justify-end">
      <UModal title="Add New Skin">
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
            </span>
            <span class="mt-2 flex w-full justify-end gap-2">
              <UButton variant="soft" color="neutral">Cancel</UButton>
              <UButton variant="solid" color="primary" @click="createSkin">Create Skin</UButton>
            </span>
          </div>
        </template>
      </UModal>
    </div>

    <div v-for="skin in skinsList" :key="skin._id">
      <div class="bg-elevated max-w-sm overflow-clip rounded-lg">
        <div>
          <img :src="skin.preview_images[0]" />
        </div>
        <div class="text-toned px-2 py-1">
          <p>{{ skin.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";

// ------ Types & Defaults ------
type SkinForm = Parameters<typeof createSkinMutation.mutate>[0];
const FORM_DEFAULT: SkinForm = {
  name: "",
  author: "",
  download_url: "",
  preview_images: [""],
};

// ------ Convex Queries & Mutations ------
const { data: skinsList, isPending: isLoadingSkins } = useConvexQuery(api.skins.listSkins);
const createSkinMutation = useConvexMutation(api.skins.createSkin);

const formState = ref(FORM_DEFAULT);
const rawFiles = ref<File[]>([]);

// ------ Helpers ------
const resetForm = () => {
  formState.value = { ...FORM_DEFAULT };
  rawFiles.value = [];
};

// ------ Handlers ------
const createSkin = async () => {
  try {
    const imageUrls = await uploadSkinImages(rawFiles.value);

    if (imageUrls.length === 0) {
      alert("Please upload at least one preview image.");
    }

    const payload: SkinForm = {
      ...formState.value,
      preview_images: imageUrls,
    };

    await createSkinMutation.mutate(payload);

    resetForm();
  } catch (error) {
    console.error("Error creating skin:", error);
    alert("An error occurred while creating the skin. Please try again.");
  }
};
</script>

<style></style>
