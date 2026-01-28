<template>
  <div class="relative mb-1 w-full max-w-2xl">
    <!-- ViewPort -->
    <div class="relative flex aspect-video h-full overflow-hidden">
      <!-- Track -->
      <div
        class="flex h-full transition-transform duration-150"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <!-- Images Container -->
        <div v-for="(image, index) in images" :key="index" class="size-full shrink-0">
          <img :src="image" alt="" class="size-full object-cover" />
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div v-if="images.length > 1">
      <UButton
        @click="prevImage"
        class="absolute top-1/2 left-1 -translate-y-1/2"
        icon="material-symbols:arrow-back-ios-new-rounded"
        color="neutral2"
        variant="soft"
      />
      <UButton
        @click="nextImage"
        class="absolute top-1/2 right-1 -translate-y-1/2 scale-x-[-1]"
        icon="material-symbols:arrow-back-ios-new-rounded"
        color="neutral2"
        variant="soft"
      />
      <!-- Indicators Container -->
      <div class="absolute -bottom-1 flex w-full items-end gap-1">
        <!-- Indicators -->
        <span
          v-for="(image, index) in images"
          :key="index"
          @click="currentIndex = index"
          class="group flex h-3 w-full cursor-pointer flex-col justify-end"
        >
          <!-- Indicator Background -->
          <div
            class="flex h-1 w-full justify-center transition-all duration-300"
            :class="currentIndex === index ? '' : 'bg-accented group-hover:brightness-125'"
          >
            <!-- Indicator Current Fill -->
            <div
              class="indicator-glow bg-primary h-full w-0 opacity-0 transition-all duration-150"
              :class="currentIndex === index ? 'w-full opacity-100' : ''"
            ></div>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  images: string[];
}>();

const currentIndex = ref(0);

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
};

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = props.images.length - 1;
  }
};
</script>

<style>
.indicator-glow {
  box-shadow: 0 0 0.5rem rgb(from var(--color-primary) r g b / 1);
}
</style>
