<template>
  <UModal title="Add a player to the website" v-model:open="isOpen" :close="false">
    <template #body>
      <div class="flex w-full flex-col gap-4">
        <div class="flex w-full flex-col gap-2" @keydown.enter="handleCreatePlayer">
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
  osu_id: undefined,
});

// ------ Props & Emits ------
const isOpen = defineModel<boolean>("open", { required: true });

// ------ External Composables ------
const toast = useAppToast();
const createPlayerMutation = useConvexMutation(api.players.createPlayer);
const { fetchPlayerInfo } = usePlayerSync();
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
      statusMessage.value = "Validating osu! player ID...";
      if (!formState.value.osu_id || formState.value.osu_id <= 0) {
        toast.warning({
          title: "Invalid Player ID",
          description: "Please enter a valid osu! Player ID that is greater than 0.",
        });
        return false;
      }

      // Always fetch player info to ensure data consistency
      statusMessage.value = "Fetching player info...";
      const { data, error } = await fetchPlayerInfo(formState.value.osu_id!);

      if (error || !data) {
        toast.error({
          title: "Failed to fetch player info",
          description: error,
        });
        return false;
      }

      statusMessage.value = "Creating player...";
      await createPlayerMutation.mutate({
        name: data.username,
        osu_id: formState.value.osu_id!,
        cover_url: data.cover.url || "",
      });

      toast.success({
        title: `Created player "${data.username}" successfully!`,
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
