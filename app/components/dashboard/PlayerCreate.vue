<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2" @keydown.enter="submitCreate">
      <NFormField label="Player ID from osu!" required>
        <UInput type="number" :default-value="0" v-model="formState.osu_id" class="w-full" />
      </NFormField>
    </div>

    <p v-if="statusMessage" class="text-muted text-xs">{{ statusMessage }}</p>
  </div>
</template>

<script lang="ts" setup>
// ------ Local Types & Defaults ------
const getDefaults = () => ({ osu_id: undefined as number | undefined });

// ------ Props & Emits ------
defineExpose({
  submitCreate,
  get isLoading() {
    return isLoading.value;
  },
});

// ------ External Composables ------
const store = useDashboardStore();
const toast = useAppToast();
const { fetchPlayerInfo } = usePlayerSync();
const { handleSubmit, statusMessage, isLoading } = useSubmitAction();
const { state: formState, reset: resetForm } = useResettableRef(getDefaults);

// ------ Handlers ------
async function submitCreate() {
  await handleSubmit(
    async () => {
      statusMessage.value = "Validating osu! player ID...";
      if (!formState.value.osu_id || formState.value.osu_id <= 0) {
        toast.warning({
          title: "Invalid Player ID",
          description: "Please enter a valid osu! Player ID greater than 0.",
        });
        return false;
      }

      statusMessage.value = "Fetching player info...";
      const { data, error } = await fetchPlayerInfo(formState.value.osu_id!);
      if (error || !data) {
        toast.error({ title: "Failed to fetch player info", description: error });
        return false;
      }

      statusMessage.value = "Creating player...";
      await $fetch("/api/players", {
        method: "POST",
        body: {
          name: data.username,
          osu_id: formState.value.osu_id!,
          cover_url: data.cover?.url || "",
        },
      });

      toast.success({ title: `Created player "${data.username}" successfully!` });
      resetForm();
      store.clearSelection();
    },
    { errorTitle: "Failed to create the player." },
  );
}
</script>
