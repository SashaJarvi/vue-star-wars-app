<template>
  <div ref="root" class="p-[40px]">Load More</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";
import { useWindowSize } from "@/composables/window-size";

const emit = defineEmits<{
  (e: "intersect"): void;
}>();

const { windowWidth } = useWindowSize();

const root: Ref<Element | null> = ref(null);
const observer: Ref<IntersectionObserver | null> = ref(null);

const rootMargin = computed<string>(() => (windowWidth.value > 767 ? "1000px" : "600px"));

onMounted(() => {
  observer.value = new IntersectionObserver(
    ([entry]) => {
      if (entry && entry.isIntersecting) {
        emit("intersect");
      }
    },
    {
      rootMargin: rootMargin.value,
    }
  );
  observer.value.observe(root.value as Element);
});

onUnmounted(() => {
  (observer.value as IntersectionObserver).disconnect();
});
</script>

<style scoped></style>
