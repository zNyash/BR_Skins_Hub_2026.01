<template>
  <main class="max-w-md mx-auto mt-10">
    <h1>hello world</h1>
    <div>
      <div class="flex flex-col gap-2">
        <span class="w-full grid grid-cols-2 gap-2">
          <UiInput placeholder="Name" v-model="playerTextInput.name" />
          <UiInput placeholder="Osu ID" type="number" v-model="playerTextInput.osu_id" />
        </span>
        <UiButton class="w-fit ml-auto" :loading="createPlayer.isPending.value" @click="createPlayerHandler"
          >Click Me</UiButton
        >
      </div>
    </div>

    <div>
      <span v-for="player in players" :key="player._id">
        <PlayerCard :name="player.name" :osu_id="player.osu_id" />
      </span>
    </div>
  </main>
</template>

<script lang="ts" setup>
import type { Id } from "~~/convex/_generated/dataModel";
import { api } from "../convex/_generated/api";

const { data: players, isPending: playersLoading } = useConvexQuery(api.players.listPlayers);
const createPlayer = useConvexMutation(api.players.createPlayer);
const deletePlayerMutation = useConvexMutation(api.players.deletePlayer);
console.log("Players list: ", players.value);

const playerTextInput = ref({ name: "", osu_id: 0 });

async function createPlayerHandler() {
  if (playerTextInput.value.name === "" || playerTextInput.value.osu_id === 0) {
    alert("Please fill in all fields.");
    return;
  }
  await createPlayer.mutate({
    name: playerTextInput.value.name,
    osu_id: playerTextInput.value.osu_id,
  });

  playerTextInput.value.name = "";
  playerTextInput.value.osu_id = 0;
}
async function deletePlayerHandler(playerId: Id<"players">) {
  await deletePlayerMutation.mutate({ player_id: playerId });
}
</script>
