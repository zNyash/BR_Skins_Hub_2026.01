export function useDashboardPlayerDraftSave() {
  const store = useDashboardStore();
  const toast = useAppToast();

  const isSaving = ref(false);

  async function savePlayerDraft() {
    if (!store.selectedPlayer || !store.draftPlayer) return;

    isSaving.value = true;
    try {
      const { hasNameChanged, hasSkinsChanged } = store.playerDiff;

      if (!hasNameChanged && !hasSkinsChanged) {
        toast.success({ title: "No changes to save." });
        return;
      }

      const requests: Promise<unknown>[] = [];

      if (hasNameChanged) {
        requests.push(
          $fetch(`/api/players/${store.selectedPlayer._id}`, {
            method: "PATCH",
            body: { name: store.draftPlayer.name },
          }),
        );
      }

      if (hasSkinsChanged) {
        requests.push(
          $fetch(`/api/player-skins/${store.selectedPlayer._id}`, {
            method: "PUT",
            body: { skin_ids: store.draftPlayer.skinIds },
          }),
        );
      }

      await Promise.all(requests);
      store.commitBaseline();
      toast.success({ title: "Player saved!" });
    } catch (err) {
      toast.error({ title: "Failed to save player.", description: (err as Error).message });
    } finally {
      isSaving.value = false;
    }
  }

  return {
    isSaving,
    savePlayerDraft,
  };
}
