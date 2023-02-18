<template>
  <footer class="py-[36px] md:py-[50px] text-center bg-black">
    <p
      class="max-w-[220px] md:max-w-none mx-auto text-white text-[14px] md:text-[18px] leading-[16px] md:leading-[21px] tracking-[0.11em] uppercase"
    >
      STAR WARS CHARACTER Encyclopedia, {{ currentYear }}
    </p>
  </footer>
</template>

<script setup lang="ts">
const currentYear: number = new Date().getFullYear();
</script>

<style scoped></style>
