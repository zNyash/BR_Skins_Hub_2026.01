<template>
  <div class="flex w-full flex-col">
    <!-- Top Bar -->
    <div class="border-muted flex w-full items-center justify-between border-b px-2 py-2">
      <UTabs
        :items="tabItems"
        :model-value="store.tab"
        :content="false"
        variant="link"
        @update:model-value="handleTabChange"
        class="-mb-2"
        :ui="{
          list: 'border-muted',
        }"
      />
      <UButton :icon="ICONS.ADD" :label="createLabel" @click="handleCreateClick" />
    </div>

    <!-- Two-Panel Layout -->
    <div class="grid h-[calc(100vh-10rem)] w-full grid-cols-[320px_1fr]">
      <!-- Left Panel -->
      <div class="border-muted flex w-full flex-col gap-2 overflow-hidden border-r p-2">
        <DashboardPlayerList
          v-if="store.tab === 'players'"
          @request-select="handleRequestSelectPlayer"
        />
        <DashboardSkinList v-else-if="store.tab === 'skins'" />
        <div v-else class="text-muted flex flex-1 items-center justify-center text-sm">
          Requests coming soon.
        </div>
      </div>

      <!-- Right Panel -->
      <div class="flex w-full flex-col items-start overflow-y-auto p-6">
        <div class="flex w-full max-w-xl flex-col">
          <!-- Empty State -->
          <div
            v-if="store.mode === 'empty'"
            class="flex h-full flex-col items-center justify-center gap-3"
          >
            <UEmpty
              title="No items selected"
              description="Select an item from the left panel or create a new one by clicking the button below."
              :actions="[
                {
                  label: createLabel,
                  variant: 'soft',
                  icon: ICONS.ADD,
                  onClick: handleCreateClick,
                },
              ]"
              variant="naked"
            />
          </div>

          <!-- Player: Edit -->
          <template
            v-else-if="store.tab === 'players' && store.mode === 'edit' && store.selectedPlayer"
          >
            <DashboardEditorContextHeader label="Editing Player" :title="store.selectedPlayer.name">
              <template #actions>
                <UButton label="Save" :loading="isSavingPlayer" @click="handleSavePlayer" />
                <UButton
                  label="Delete"
                  color="error"
                  variant="soft"
                  :loading="isDeletingPlayer"
                  @click="handleDeletePlayer"
                />
              </template>
            </DashboardEditorContextHeader>
            <DashboardPlayerEditor />
          </template>

          <!-- Player: Create -->
          <template v-else-if="store.tab === 'players' && store.mode === 'create'">
            <DashboardEditorContextHeader label="Creating Player" title="New Player">
              <template #actions>
                <UButton
                  label="Save"
                  :loading="isCreatingPlayer"
                  @click="playerCreateRef?.submitCreate()"
                />
                <UButton
                  label="Cancel"
                  variant="soft"
                  color="neutral"
                  @click="store.clearSelection()"
                />
              </template>
            </DashboardEditorContextHeader>
            <DashboardPlayerCreate ref="playerCreateRef" />
          </template>

          <!-- Skin: Edit -->
          <template
            v-else-if="store.tab === 'skins' && store.mode === 'edit' && store.selectedSkin"
          >
            <DashboardEditorContextHeader label="Editing Skin" :title="store.selectedSkin.name">
              <template #actions>
                <UButton
                  label="Save"
                  :loading="isSavingSkin"
                  @click="skinEditorRef?.submitSave()"
                />
                <UButton
                  label="Delete"
                  color="error"
                  variant="soft"
                  :loading="isDeletingSkin"
                  @click="handleDeleteSkin"
                />
              </template>
            </DashboardEditorContextHeader>
            <DashboardSkinEditor ref="skinEditorRef" :skin="store.selectedSkin" />
          </template>

          <!-- Skin: Create -->
          <template v-else-if="store.tab === 'skins' && store.mode === 'create'">
            <DashboardEditorContextHeader label="Creating Skin" title="New Skin">
              <template #actions>
                <UButton
                  label="Save"
                  :loading="isCreatingSkin"
                  @click="skinCreateRef?.submitCreate()"
                />
                <UButton
                  label="Cancel"
                  variant="soft"
                  color="neutral"
                  @click="store.clearSelection()"
                />
              </template>
            </DashboardEditorContextHeader>
            <DashboardSkinCreate ref="skinCreateRef" />
          </template>

          <!-- Requests placeholder -->
          <div
            v-else-if="store.tab === 'requests'"
            class="text-muted flex h-full items-center justify-center text-sm"
          >
            Request management coming soon.
          </div>
        </div>
      </div>
    </div>

    <!-- Discard Confirmation -->
    <DashboardDiscardConfirmModal
      v-model:open="isDiscardOpen"
      @save="handleDiscardSave"
      @discard="handleDiscardDiscard"
      @cancel="
        discardGuard.clearPending();
        discardGuard.close();
      "
    />
  </div>
</template>

<script lang="ts" setup>
import type { Doc } from "~~/convex/_generated/dataModel";
import { ICONS } from "~/types/icons";

// ------ Local Types & Defaults ------
type CreatePanelRef = {
  submitCreate: () => Promise<void>;
  isLoading: boolean;
};
type SkinEditorRef = {
  submitSave: () => Promise<void>;
  isLoading: boolean;
};

// ------ External Composables ------
const store = useDashboardStore();
const toast = useAppToast();
const discardGuard = useDiscardGuard(computed(() => store.isDirty));
const { isSaving: isSavingPlayer, savePlayerDraft } = useDashboardPlayerDraftSave();

// ------ Local State ------
const isDeletingPlayer = ref(false);
const isDeletingSkin = ref(false);
const playerCreateRef = ref<CreatePanelRef | null>(null);
const skinCreateRef = ref<CreatePanelRef | null>(null);
const skinEditorRef = ref<SkinEditorRef | null>(null);

// ------ Computed ------
const tabItems = computed(() => [
  { value: "players", label: "Players" },
  { value: "skins", label: "Skins" },
  { value: "requests", label: "Requests", disabled: true },
]);

const createLabel = computed(() => {
  if (store.tab === "players") return "Create Player";
  if (store.tab === "skins") return "Create Skin";
  return "Create";
});

const isCreatingPlayer = computed(() => !!playerCreateRef.value?.isLoading);
const isCreatingSkin = computed(() => !!skinCreateRef.value?.isLoading);
const isSavingSkin = computed(() => !!skinEditorRef.value?.isLoading);
const isDiscardOpen = computed({
  get: () => discardGuard.isOpen.value,
  set: (value: boolean) => {
    discardGuard.isOpen.value = value;
  },
});

// ------ Actions ------
async function handleDeletePlayer() {
  if (!store.selectedPlayer) return;

  isDeletingPlayer.value = true;
  try {
    await $fetch(`/api/players/${store.selectedPlayer._id}`, { method: "DELETE" });
    toast.success({ title: "Player deleted." });
    store.clearSelection();
  } catch (err) {
    toast.error({ title: "Failed to delete player.", description: (err as Error).message });
  } finally {
    isDeletingPlayer.value = false;
  }
}

async function handleDeleteSkin() {
  if (!store.selectedSkin) return;

  isDeletingSkin.value = true;
  try {
    await $fetch(`/api/skins/${store.selectedSkin._id}`, { method: "DELETE" });
    toast.success({ title: "Skin deleted." });
    store.clearSelection();
  } catch (err) {
    toast.error({ title: "Failed to delete skin.", description: (err as Error).message });
  } finally {
    isDeletingSkin.value = false;
  }
}

// ------ Handlers ------
function handleTabChange(newTab: string | number) {
  discardGuard.guard(() => store.setTab(newTab as typeof store.tab));
}

function handleCreateClick() {
  discardGuard.guard(() => store.enterCreateMode());
}

function handleRequestSelectPlayer(player: Doc<"players">) {
  discardGuard.guard(() => store.selectPlayer(player));
}

function handleSavePlayer() {
  savePlayerDraft();
}

async function handleDiscardSave() {
  discardGuard.close();
  await savePlayerDraft();
  const next = discardGuard.consumePending();
  next?.();
}

function handleDiscardDiscard() {
  store.resetDraft();
  discardGuard.close();
  const next = discardGuard.consumePending();
  next?.();
}

// ------ Lifecycle ------
useSeoMeta({
  title: "Admin Dashboard | BR Skins Hub",
  ogTitle: "Admin Dashboard | BR Skins Hub",
});
</script>
