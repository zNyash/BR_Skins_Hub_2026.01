<template>
  <div class="flex flex-col gap-4">
    <!-- Basic Info -->
    <div class="flex flex-col gap-2">
      <NFormField label="Player Username" class="w-full">
        <UFieldGroup class="w-full">
          <UInput
            :model-value="store.draftPlayer!.name"
            placeholder="Name"
            class="w-full"
            @update:model-value="store.draftPlayer!.name = $event"
          />
          <UButton
            :icon="ICONS.REFRESH"
            color="neutral"
            variant="subtle"
            :loading="isSyncing"
            @click="handleRefresh"
          />
        </UFieldGroup>
      </NFormField>
    </div>

    <USeparator />

    <!-- Skin Selector -->
    <NFormField label="Linked Skins" class="w-full">
      <DashboardPlayerSkinSelector
        v-if="allSkins && !isLoadingSkins"
        :skins="allSkins"
        v-model="store.draftPlayer!.skinIds"
      />
      <p v-else class="text-muted mt-1 text-xs">Loading skins...</p>
    </NFormField>
  </div>
</template>

<script lang="ts" setup>
import { api } from "~~/convex/_generated/api";
import { ICONS } from "~/types/icons";

// ------ External Composables ------
const store = useDashboardStore();
const toast = useAppToast();
const { syncPlayer, isLoading: isSyncing } = usePlayerSync();

const { data: allSkins, isPending: isLoadingSkins } = useConvexQuery(api.skins.listSkins);
const { data: playerSkins } = useConvexQuery(
  api.playerSkins.getSkinsByPlayer,
  computed(() => ({ player_id: store.selectedPlayer!._id })),
);

// ------ Watchers ------
// Populate draft skin IDs once the query resolves or when selection changes
watch(
  [playerSkins, () => store.selectedPlayer?._id],
  ([skins]) => {
    if (skins) store.initDraftSkins(skins.map((s) => s._id));
  },
  { immediate: true },
);

// ------ Handlers ------
async function handleRefresh() {
  const { successMessage, errorMessage } = await syncPlayer(store.selectedPlayer!);
  if (successMessage) {
    toast.success({ title: successMessage });
  } else {
    toast.error({
      title: `Failed to refresh player "${store.selectedPlayer!.name}".`,
      description: errorMessage,
    });
  }
}
</script>
