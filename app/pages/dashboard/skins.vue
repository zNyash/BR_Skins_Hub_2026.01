<template>
  <div class="max-w-lg flex flex-col items-center mx-auto">
    <UModal>
      <template #trigger>
        <UButton>Open Skins Modal</UButton>

      </template>
    </UModal>
    
    <div v-for="skin in skinsList" :key="skin._id">
      {{ skin.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { api } from '~~/convex/_generated/api';

const {data: skinsList, isPending: isLoadingSkins} = useConvexQuery(api.skins.listSkins);

</script>

<style>

</style>