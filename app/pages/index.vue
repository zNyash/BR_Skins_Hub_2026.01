<template>
  <main class="mx-auto mt-10 max-w-md">
    <UEmpty
      variant="naked"
      icon="ic:round-warning"
      title="There's nothing here yet."
      description="Here will be the display of all players and when clicked it would go to their page where it would be listed all of their skins."
      :actions="[
        {
          label: 'Go to players',
          to: '/dashboard/players',
          variant: 'solid',
          color: 'primary',
        },
      ]"
    />
  </main>
</template>

<script lang="ts" setup></script>
