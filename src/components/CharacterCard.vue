<template>
  <article
    class="flex flex-col items-center gap-[10px] py-[32px] md:py-[92px] bg-black rounded-[8px] drop-shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:drop-shadow-[0px_10px_40px_rgba(37,136,167,0.38)] ease-in duration-300 cursor-pointer"
    @click="emit('open-modal', character.url)"
  >
    <character-avatar :name="character.name" />

    <h2 class="text-white text-[18px] leading-[21px] font-bold">{{ character.name }}</h2>
  </article>
</template>

<script setup lang="ts">
import type { ICharacter } from "@/ts/interfaces/character";
import CharacterAvatar from "@/components/CharacterAvatar.vue";

defineProps<{
  character: ICharacter;
}>();

const emit = defineEmits<{
  (e: "open-modal", url: string): void;
}>();
</script>

<style scoped></style>
