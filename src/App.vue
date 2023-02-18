<template>
  <the-header />

  <main class="flex-1 grid place-items-center">
    <Suspense>
      <transition name="dashboard-fade" mode="out-in" appear><the-dashboard /></transition>

      <template #fallback>
        <transition name="loader-fadeout" mode="in-out"><the-loader class="py-[60px] md:py-[120px]" /></transition>
      </template>
    </Suspense>
  </main>

  <the-footer />
</template>

<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import TheDashboard from "@/components/TheDashboard.vue";
import TheLoader from "@/components/TheLoader.vue";
import TheFooter from "@/components/TheFooter.vue";
</script>

<style lang="scss" scoped>
.dashboard-fade-enter-active,
.dashboard-fade-leave-active {
  transition: all 1s ease;
}

.dashboard-fade-enter-from,
.dashboard-fade-leave-to {
  opacity: 0;
  transform: translateY(40px);
}

.loader-fadeout-enter-active,
.loader-fadeout-leave-active {
  transition: all 0.5s ease-out;
}

.loader-fadeout-leave-to {
  opacity: 1;
  transform: scale(1);
}
</style>
