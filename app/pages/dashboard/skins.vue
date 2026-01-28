<template>
  <div class="flex w-full max-w-2xl flex-col items-center gap-4">
    <div class="flex w-full justify-end">
      <ModalsCreateSkin />
    </div>

    <!-- Skins Display -->
    <div class="grid w-full grid-cols-2 gap-2">
      <SkinCard v-for="skin in skinsList" :key="skin._id" :skin="skin" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { api } from "~~/convex/_generated/api";

// ------ Convex Queries & Mutations ------
const { data: skinsList, isPending: isLoadingSkins } = useConvexQuery(api.skins.listSkins);
</script>

<style></style>
