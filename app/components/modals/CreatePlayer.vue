<template>
  <UModal title="Add a player to the website" v-model:open="isModalOpen" :close="false">
    <UButton label="Add Player" class="ml-auto w-fit" />
    <template #body>
      <div class="flex flex-col items-start gap-2">
        <span class="flex w-full flex-col gap-0.5">
          <p class="text-muted text-xs">Player Username</p>
          <UInput placeholder="Name" v-model="inputPlayer.name" />
        </span>
        <span class="flex w-full flex-col gap-0.5">
          <p class="text-muted text-xs">Player ID from osu!</p>
          <UInput type="number" :default-value="0" v-model="inputPlayer.osu_id" />
        </span>
        <span class="flex w-full flex-row justify-end gap-2">
          <UButton
            @click="
              () => {
                isModalOpen = false;
              }
            "
            label="Cancel"
            variant="ghost"
            color="neutral"
            class="mt-4"
          />
          <UButton @click="handlerCreatePlayer" label="Save" class="mt-4" />
        </span>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { api } from "~~/convex/_generated/api";
const toast = useToast();
const isModalOpen = ref(false);
const inputPlayer = ref({ name: "", osu_id: 0 });

const mutationCreatePlayer = useConvexMutation(api.players.createPlayer);
const handlerCreatePlayer = async () => {
  if (inputPlayer.value.osu_id === 0) {
    toast.add({
      icon: "lucide:alert-circle",
      title: "Invalid Player ID",
      description: "Please enter a valid osu! Player ID greater than 0.",
      color: "error",
    });
    return;
  }

  isModalOpen.value = false;

  if (inputPlayer.value.name.trim() === "") {
    const name = await $fetch("/api/player/refresh", {
      method: "GET",
      params: {
        osu_id: inputPlayer.value.osu_id,
      },
    });
    inputPlayer.value.name = name;
  }

  await mutationCreatePlayer.mutate({
    name: inputPlayer.value.name,
    osu_id: inputPlayer.value.osu_id,
  });

  inputPlayer.value.name = "";
  inputPlayer.value.osu_id = 0;
};
</script>

<style></style>
