<template>
  <div class="grid place-items-center w-[80px] h-[80px] rounded-full" :style="{ backgroundColor: getRandomColor() }">
    <p class="text-white text-[48px] font-medium leading-[56px]">{{ firstNameLetter }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import getRandomColor from "@/utils/get-random-color";

const props = defineProps<{
  name: string | undefined;
}>();

const firstNameLetter = computed<string>(() => {
  if (!props.name) {
    return "";
  }

  return props.name[0];
});
</script>

<style scoped></style>
