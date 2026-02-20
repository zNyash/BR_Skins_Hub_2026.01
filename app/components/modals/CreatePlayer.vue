<template>
  <UModal title="Add a player to the website" v-model:open="isOpen" :close="false">
    <template #body>
      <div class="flex w-full flex-col gap-4">
        <div class="flex w-full flex-col gap-2" @keydown.enter="handleCreatePlayer">
          <NFormField label="Player Username">
            <UInput placeholder="Name" v-model="formState.name" class="w-full" />
          </NFormField>
          <NFormField label="Player ID from osu!" required>
            <UInput type="number" :default-value="0" v-model="formState.osu_id" class="w-full" />
          </NFormField>
        </div>
        <NSaveCancel
          @save="handleCreatePlayer"
          @cancel="closeModal"
          :loading-text="statusMessage"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { api } from "~~/convex/_generated/api";

// ------ Local Types & Defaults ------
const getDefaultFormState = () => ({
  name: "",
  osu_id: undefined,
});

// ------ Props & Emits ------
const isOpen = defineModel<boolean>("open", { required: true });

// ------ External Composables ------
const toast = useAppToast();
const createPlayerMutation = useConvexMutation(api.players.createPlayer);
const { fetchPlayerUsername } = usePlayerNameRefresh();
const { handleSubmit, statusMessage } = useSubmitAction();
const { state: formState, reset: resetForm } = useResettableRef(getDefaultFormState);

// ------ Watchers ------
watch(
  () => isOpen.value,
  (newVal) => {
    if (!newVal) {
      resetAll();
    }
  },
);

// ------ Actions ------
const resetAll = () => {
  resetForm();
  statusMessage.value = "";
};
const closeModal = () => {
  isOpen.value = false;
};

// ------ Handlers ------
const handleCreatePlayer = () =>
  handleSubmit(
    async () => {
      statusMessage.value = "Checking changes...";
      if (!formState.value.osu_id || formState.value.osu_id <= 0) {
        toast.warning({
          title: "Invalid Player ID",
          description: "Please enter a valid osu! Player ID that is greater than 0.",
        });
        return false;
      }

      let finalName = formState.value.name.trim();
      if (!finalName) {
        statusMessage.value = "Fetching player username...";
        finalName = await fetchPlayerUsername(formState.value.osu_id);
      }

      statusMessage.value = "Creating player...";
      await createPlayerMutation.mutate({
        name: finalName,
        osu_id: formState.value.osu_id,
      });

      toast.success({
        title: `Created player "${finalName}" successfully!`,
      });

      closeModal();
      resetAll();
    },
    {
      errorTitle: "Failed to create the player.",
    },
  );
</script>

<style></style>
