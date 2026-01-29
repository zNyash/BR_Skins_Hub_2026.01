<template>
  <UModal title="Editing Player" :close="false" v-model:open="isOpen">
    <template #body>
      <span class="flex w-full flex-col items-start gap-4">
        <!-- Inputs -->
        <div class="flex w-full flex-col items-start gap-2">
          <NFormField label="Player Username" class="w-full">
            <UFieldGroup class="w-full">
              <UInput
                placeholder="Name"
                v-model="playerNameInput"
                class="w-full"
                @keydown.enter="handleSaveChanges"
              />
              <UButton
                icon="lucide:refresh-ccw"
                color="neutral"
                variant="subtle"
                @click="handleRefreshClick"
                :loading="isRefreshingUsername"
              />
            </UFieldGroup>
          </NFormField>
        </div>

        <NSaveCancel @save="handleSaveChanges" @cancel="closeModal" :loading-text="statusMessage" />
      </span>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

// ------ Props & Emits ------
const props = defineProps<{
  _playerId: Id<"players">;
  playerName: string;
  osuId: number;
}>();

// ------ Composables ------
const updatePlayerMutation = useConvexMutation(api.players.updatePlayer);
const { isLoading: isRefreshingUsername, refreshPlayerName } = usePlayerNameRefresh();
const { handleSubmit, statusMessage } = useSubmitAction();
const toast = useAppToast();

// ------ State ------
const isOpen = defineModel<boolean>("open", { required: true });
const playerNameInput = ref(props.playerName);

// ------ Watchers ------
watch(
  () => props.playerName,
  (newName) => {
    playerNameInput.value = newName;
  },
);
watch(
  () => isOpen.value,
  (newVal) => {
    if (!newVal) {
      playerNameInput.value = props.playerName;
      statusMessage.value = "";
    }
  },
);

// ------ Helpers ------
const closeModal = () => {
  isOpen.value = false;
};

// ------ Methods ------
const handleSaveChanges = () =>
  handleSubmit(
    async () => {
      statusMessage.value = "Checking changes...";
      if (playerNameInput.value.trim() === props.playerName) {
        toast.success({
          title: "No changes were made to the player.",
        });
        closeModal();
        return false;
      }

      statusMessage.value = "Updating player...";
      await updatePlayerMutation.mutate({
        id: props._playerId,
        name: playerNameInput.value,
      });

      toast.success({
        title: `Successfully updated player's username to ${playerNameInput.value}!`,
      });

      closeModal();
    },
    {
      errorTitle: `Error updating player's username to ${playerNameInput.value}.`,
    },
  );

const handleRefreshClick = async () => {
  // refreshPlayerName handles its own loading state and toasts
  await refreshPlayerName({
    osuId: props.osuId,
    currentUsername: props.playerName,
    playerId: props._playerId,
  });
};
</script>

<style></style>
