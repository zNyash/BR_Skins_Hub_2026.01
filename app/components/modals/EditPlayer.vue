<template>
  <UModal title="Editing Player" :close="false" v-model:open="isOpen" :ui="{ content: 'max-w-xl' }">
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

          <USeparator class="my-2" />

          <NFormField label="Linked Skins" class="w-full">
            <PlayerSkinSelector
              v-if="!isLoadingPlayerSkins && allSkins"
              :skins="allSkins"
              v-model="selectedSkinsIds"
            />
            <p v-else class="text-muted mt-1 text-xs">Loading skins...</p>
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
const isOpen = defineModel<boolean>("open", { required: true });

// ------ External Composables ------
const updatePlayerMutation = useConvexMutation(api.players.updatePlayer);
const updateSkinsMutation = useConvexMutation(api.playerSkins.updatePlayerSkins);
const { isLoading: isRefreshingUsername, refreshPlayerName } = usePlayerNameRefresh();
const { handleSubmit, statusMessage } = useSubmitAction();
const toast = useAppToast();

const { data: allSkins } = useConvexQuery(api.skins.listSkins, {});
const { data: playerSkinsRel, isPending: isLoadingPlayerSkins } = useConvexQuery(
  api.playerSkins.getSkinsByPlayer,
  {
    player_id: props._playerId,
  },
);

// ------ Local State ------
const playerNameInput = ref(props.playerName);
const selectedSkinsIds = ref<Id<"skins">[]>([]);

// ------ Watchers ------
watch(
  () => props.playerName,
  (newName) => {
    playerNameInput.value = newName;
  },
);

// Initialize selected skins when data loads or modal opens
watch(
  [playerSkinsRel, isOpen],
  ([skins, open]) => {
    if (open && skins) {
      selectedSkinsIds.value = skins.map((s) => s._id);
    }
  },
  { immediate: true },
);

watch(
  () => isOpen.value,
  (newVal) => {
    if (!newVal) {
      playerNameInput.value = props.playerName;
      statusMessage.value = "";
      // Don't reset selectedSkins here, rely on the watch above to sync when re-opening
    }
  },
);

// ------ Actions ------
const closeModal = () => {
  isOpen.value = false;
};

// ------ Handlers ------
const handleRefreshClick = async () => {
  // refreshPlayerName handles its own loading state and toasts
  await refreshPlayerName({
    osuId: props.osuId,
    currentUsername: props.playerName,
    playerId: props._playerId,
  });
};

const handleSaveChanges = () =>
  handleSubmit(
    async () => {
      statusMessage.value = "Checking changes...";

      const hasNameChanged = playerNameInput.value.trim() !== props.playerName;

      // Check if skins changed
      const currentIds = new Set<Id<"skins">>(selectedSkinsIds.value);
      const initialIds = new Set<Id<"skins">>(playerSkinsRel.value?.map((s) => s._id) || []);

      // Simple set equality check
      let hasSkinsChanged = false;
      if (initialIds.size !== currentIds.size) {
        hasSkinsChanged = true;
      } else {
        for (const id of currentIds) {
          if (!initialIds.has(id)) {
            hasSkinsChanged = true;
            break;
          }
        }
      }

      if (!hasNameChanged && !hasSkinsChanged) {
        toast.success({
          title: "No changes were made.",
        });
        closeModal();
        return false;
      }

      const promises = [];

      if (hasNameChanged) {
        statusMessage.value = "Updating username...";
        promises.push(
          updatePlayerMutation.mutate({
            id: props._playerId,
            name: playerNameInput.value,
          }),
        );
      }

      if (hasSkinsChanged) {
        statusMessage.value = "Updating skins...";
        promises.push(
          updateSkinsMutation.mutate({
            player_id: props._playerId,
            skin_ids: Array.from(currentIds),
          }),
        );
      }

      await Promise.all(promises);

      toast.success({
        title: "Player updated successfully!",
      });

      closeModal();
    },
    {
      errorTitle: `Error updating player.`,
    },
  );
</script>

<style></style>
