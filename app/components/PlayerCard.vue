<template>
  <p>{{ name }} ({{ osu_id }})</p>
</template>

<script lang="ts" setup>
defineProps<{
  name: string;
  osu_id: number;
}>();
</script>
