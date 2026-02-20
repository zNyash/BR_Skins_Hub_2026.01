<template>
  <Transition name="player-card">
    <div
      v-if="!hasBeenDeleted"
      :class="[
        'bg-muted/50 border-muted/50 flex flex-row items-center gap-2 rounded-md border p-2 transition-opacity',
        isDeleting ? 'pointer-events-none opacity-50 grayscale' : '',
      ]"
    >
      <UAvatar :alt="playerName" :src="`https://a.ppy.sh/${osuId}`" />
      <span class="flex flex-col justify-center">
        <p class="font-medium">{{ playerName }}</p>
        <p class="text-muted -mt-1 text-xs">{{ osuId }}</p>
      </span>
      <span class="ml-auto flex items-center gap-1">
        <UTooltip text="Refresh Username" :delay-duration="TOOLTIP.DELAY">
          <UButton
            :icon="ICONS.REFRESH"
            color="neutral"
            variant="ghost"
            @click="handleRefreshClick"
            :loading="isLoading"
          />
        </UTooltip>

        <UTooltip text="Edit Player" :delay-duration="TOOLTIP.DELAY">
          <UButton icon="lucide:edit" variant="ghost" color="info" @click="isEditing = true" />
        </UTooltip>
        <ModalsEditPlayer
          v-model:open="isEditing"
          :_playerId="_playerId"
          :player-name="playerName"
          :osu-id="osuId"
        />

        <UTooltip
          :text="confirmDelete ? 'Click again to confirm' : 'Delete Player'"
          :delay-duration="TOOLTIP.DELAY"
        >
          <UButton
            :icon="confirmDelete ? ICONS.WARNING : ICONS.DELETE"
            @click="handleDeleteClick"
            variant="ghost"
            :color="confirmDelete ? 'warning' : 'error'"
            :loading="isDeleting"
            @mouseleave="confirmDelete = false"
          />
        </UTooltip>
      </span>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { TOOLTIP } from "~/types/constants";
import { ICONS } from "~/types/icons";
import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

// ------ Props & Emits ------
const props = defineProps<{
  playerName: string;
  osuId: number;
  _playerId: Id<"players">;
}>();

// ------ External Composables ------
const toast = useAppToast();
const deletePlayerMutation = useConvexMutation(api.players.deletePlayer);
const updateSkinsMutation = useConvexMutation(api.playerSkins.updatePlayerSkins);
const { isLoading, refreshPlayerName } = usePlayerNameRefresh();

// ------ Local State ------
const isDeleting = ref(false);
const isEditing = ref(false);
const hasBeenDeleted = ref(false);
const confirmDelete = ref(false);

// ------ Actions ------
const performPlayerDelete = async () => {
  try {
    isDeleting.value = true;
    await deletePlayerMutation.mutate({ player_id: props._playerId });

    updateSkinsMutation.mutate({
      player_id: props._playerId,
      skin_ids: [],
    });

    hasBeenDeleted.value = true;

    toast.success({
      title: `Deleted the player "${props.playerName}" successfully!`,
    });
  } catch (error) {
    console.error("Error deleting player:", error);
    isDeleting.value = false;
    confirmDelete.value = false;

    toast.error({
      title: "Failed to delete the player.",
      description: (error as Error).message,
    });
  }
};

// ------ Handlers ------
const handleDeleteClick = () => {
  if (!confirmDelete.value) {
    confirmDelete.value = true;
    setTimeout(() => {
      confirmDelete.value = false;
    }, 3000);
  } else {
    performPlayerDelete();
  }
};

const handleRefreshClick = async () => {
  await refreshPlayerName({
    osuId: props.osuId,
    currentUsername: props.playerName,
    playerId: props._playerId,
  });
};
</script>

<style scoped>
.player-card-enter-active,
.player-card-leave-active {
  transition: all 0.3s ease;
}
.player-card-enter-from,
.player-card-leave-to {
  opacity: 0;
}
.player-card-enter-to,
.player-card-leave-from {
  opacity: 1;
}
</style>
