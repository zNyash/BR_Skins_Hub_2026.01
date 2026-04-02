<template>
  <UModal title="Edit Skin" :close="false" v-model:open="isOpen">
    <template #body>
      <div class="flex w-full flex-col gap-4">
        <div class="flex w-full flex-col gap-2">
          <NFormField label="Name">
            <UInput v-model="formdata.name" class="w-full" />
          </NFormField>
          <NFormField label="Download URL">
            <UInput v-model="formdata.downloadUrl" class="w-full" />
          </NFormField>
        </div>
        <NSaveCancel @save="onSave" @cancel="closeModal" :loading-text="statusMessage" />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { Doc } from "~~/convex/_generated/dataModel";

// ------ Local Types & Defaults ------
type Skin = Doc<"skins">;

// ------ Props & Emits ------
const props = defineProps<{
  skin: Skin;
}>();
const isOpen = defineModel<boolean>("open", { required: true });

// ------ External Composables ------
const { handleSubmit, statusMessage } = useSubmitAction();
const toast = useAppToast();

const getUpdatedFormData = () => ({
  name: props.skin.name,
  downloadUrl: props.skin.download_url,
});
const { state: formdata, reset: resetForm } = useResettableRef(getUpdatedFormData);

// ------ Local State ------

// ------ Watchers ------
watch(
  () => isOpen.value,
  (newVal) => {
    if (!newVal) {
      resetForm();
      statusMessage.value = "";
    }
  },
);

// ------ Actions ------
const closeModal = () => {
  isOpen.value = false;
};

// ------ Handlers ------
const onSave = () =>
  handleSubmit(
    async () => {
      statusMessage.value = "Checking for changes...";
      if (
        formdata.value.name === props.skin.name &&
        formdata.value.downloadUrl === props.skin.download_url
      ) {
        toast.success({
          title: "No changes were made to the skin.",
        });

        closeModal();
        return false;
      }

      statusMessage.value = "Updating skin...";
      await $fetch(`/api/skins/${props.skin._id}`, {
        method: "PATCH",
        body: {
          name: formdata.value.name,
          download_url: formdata.value.downloadUrl,
        },
      });

      toast.success({
        title: "The skin has been successfully updated!",
      });

      closeModal();
      resetForm();
    },
    {
      errorTitle: "An error occurred while updating the skin.",
    },
  );
</script>

<style></style>
