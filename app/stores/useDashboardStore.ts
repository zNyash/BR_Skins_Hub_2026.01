import { defineStore } from "pinia";
import type { Doc, Id } from "~~/convex/_generated/dataModel";
import { hasSetDifference } from "~/utils/hasSetDifference";

// ------ Local Types ------
export type DashboardTab = "players" | "skins" | "requests";
export type EditorMode = "empty" | "edit" | "create";

export type DraftPlayer = {
  name: string;
  skinIds: Id<"skins">[];
};

type Baseline = {
  name: string;
  skinIds: Id<"skins">[];
};

export const useDashboardStore = defineStore("dashboard", () => {
  // ------ State ------
  const tab = ref<DashboardTab>("players");
  const mode = ref<EditorMode>("empty");
  const selectedPlayer = ref<Doc<"players"> | null>(null);
  const selectedSkin = ref<Doc<"skins"> | null>(null);
  const draftPlayer = ref<DraftPlayer | null>(null);

  // Private snapshot used for dirty tracking
  const _baseline = ref<Baseline | null>(null);

  // ------ Computed ------
  const isDirty = computed(() => {
    if (!draftPlayer.value || !_baseline.value) return false;

    if (draftPlayer.value.name.trim() !== _baseline.value.name) return true;

    return hasSetDifference(draftPlayer.value.skinIds, _baseline.value.skinIds);
  });

  // ------ Actions ------
  function setTab(newTab: DashboardTab) {
    tab.value = newTab;
    clearSelection();
  }

  // Step 1: select the player (skins not yet loaded)
  function selectPlayer(player: Doc<"players">): void {
    selectedPlayer.value = player;
    selectedSkin.value = null;
    mode.value = "edit";
    draftPlayer.value = { name: player.name, skinIds: [] };
    _baseline.value = { name: player.name, skinIds: [] };
  }

  // Step 2: called by PlayerEditor once the skin relation query resolves
  function initDraftSkins(skinIds: Id<"skins">[]): void {
    if (!draftPlayer.value) return;
    draftPlayer.value.skinIds = [...skinIds];
    if (_baseline.value) _baseline.value.skinIds = [...skinIds];
  }

  function selectSkin(skin: Doc<"skins">): void {
    selectedSkin.value = skin;
    selectedPlayer.value = null;
    draftPlayer.value = null;
    _baseline.value = null;
    mode.value = "edit";
  }

  function enterCreateMode(): void {
    selectedPlayer.value = null;
    selectedSkin.value = null;
    draftPlayer.value = null;
    _baseline.value = null;
    mode.value = "create";
  }

  function resetDraft(): void {
    if (!_baseline.value) return;
    draftPlayer.value = { name: _baseline.value.name, skinIds: [..._baseline.value.skinIds] };
  }

  function commitBaseline(): void {
    if (!draftPlayer.value) return;
    _baseline.value = { name: draftPlayer.value.name, skinIds: [...draftPlayer.value.skinIds] };
  }

  // Returns which fields differ between draft and baseline (used by save logic in views)
  const playerDiff = computed(() => {
    if (!draftPlayer.value || !_baseline.value)
      return { hasNameChanged: false, hasSkinsChanged: false };

    const hasNameChanged = draftPlayer.value.name.trim() !== _baseline.value.name;
    const hasSkinsChanged = hasSetDifference(draftPlayer.value.skinIds, _baseline.value.skinIds);

    return { hasNameChanged, hasSkinsChanged };
  });

  function clearSelection(): void {
    selectedPlayer.value = null;
    selectedSkin.value = null;
    draftPlayer.value = null;
    _baseline.value = null;
    mode.value = "empty";
  }

  return {
    tab,
    mode,
    selectedPlayer,
    selectedSkin,
    draftPlayer,
    isDirty,
    playerDiff,
    setTab,
    selectPlayer,
    initDraftSkins,
    selectSkin,
    enterCreateMode,
    resetDraft,
    commitBaseline,
    clearSelection,
  };
});
