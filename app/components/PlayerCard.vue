<template>
  <Transition name="player-card">
    <div
      v-if="!hasBeenDeleted"
      :class="[
        'bg-muted/50 border-muted/50 flex flex-row items-center gap-2 rounded-md border p-2 transition-opacity',
        isDeleting ? 'pointer-events-none opacity-50 grayscale' : '',
      ]"
    >
      <UAvatar :alt="name" :src="`https://a.ppy.sh/${osu_id}`" />
      <span class="flex flex-col justify-center">
        <p class="font-medium">{{ name }}</p>
        <p class="text-muted -mt-1 text-xs">{{ osu_id }}</p>
      </span>
      <span class="ml-auto flex items-center gap-1">
        <UTooltip text="Refresh Username">
          <UButton
            icon="lucide:refresh-ccw"
            color="neutral"
            variant="ghost"
            @click="handlePlayerNameRefresh"
            :loading="isRefreshingUsername"
          />
        </UTooltip>

        <ModalsEditPlayer :player-id="_id" :player-name="name" :osu-id="osu_id" />

        <!-- Lógica de Confirmação de Deleção -->
        <UTooltip :text="confirmDelete ? 'Click again to confirm' : 'Delete Player'">
          <UButton
            :icon="confirmDelete ? 'lucide:alert-triangle' : 'lucide:trash-2'"
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
import { api } from "~~/convex/_generated/api";
import type { Id } from "~~/convex/_generated/dataModel";

const props = defineProps<{
  name: string;
  osu_id: number;
  _id: Id<"players">;
}>();

const toast = useToast();


/* --------------------------- */
/* Deletion Confirmation Logic */
/* --------------------------- */
const hasBeenDeleted = ref(false);
const confirmDelete = ref(false);
const handleDeleteClick = () => {
  if (!confirmDelete.value) {
    confirmDelete.value = true;
    setTimeout(() => {
      confirmDelete.value = false;
    }, 3000);
  } else {
    handlePlayerDelete();
  }
};

/* --------------------- */
/* Player Deletion Logic */
/* --------------------- */
const isDeleting = ref(false);
const deletePlayerMutation = useConvexMutation(api.players.deletePlayer);
const handlePlayerDelete = async () => {
  try {
    isDeleting.value = true;
    await deletePlayerMutation.mutate({ player_id: props._id });

    hasBeenDeleted.value = true;

    toast.add({
      icon: "lucide:trash-2",
      title: `Deleted the player ${props.name}`,
      color: "success",
      duration: 2000,
    });
  } catch (error) {
    console.error("Error deleting player:", error);
    isDeleting.value = false;
    confirmDelete.value = false;

    toast.add({
      icon: "lucide:circle-x",
      title: "Error deleting player",
      description: (error as Error).message,
      color: "error",
    });
  }
};

/* ----------------------------- */
/* Player Username Refresh Logic */
/* ----------------------------- */
const isRefreshingUsername = ref(false);
const mutationPlayerUpdate = useConvexMutation(api.players.updatePlayer);
const handlePlayerNameRefresh = async () => {
  try {
    isRefreshingUsername.value = true;

    const username = await $fetch("/api/player/refresh", {
      method: "GET",
      params: { osu_id: props.osu_id },
    });

    await mutationPlayerUpdate.mutate({
      id: props._id,
      name: username,
    });

    toast.add({
      title: "Username updated!",
      color: "success",
      duration: 1500,
    });
  } catch (error) {
    console.error("Error refreshing player name:", error);
    toast.add({
      icon: "lucide:alert-circle",
      title: "Failed to refresh name",
      description: "Could not connect to osu! API",
      color: "error",
    });
  } finally {
    isRefreshingUsername.value = false;
  }
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
