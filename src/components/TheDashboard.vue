<template>
  <div class="max-w-none md:max-w-[calc(1216px+(24px*2))] w-full h-full pt-[80px] px-[24px] pb-[160px]">
    <div class="input-group relative max-w-[800px] w-full mx-auto mb-[44px] md:mb-[80px]">
      <input
        v-model="searchStr"
        class="form-control w-full pt-[27px] pb-[8px] text-grey text-[16px] md:text-[18px] leading-[19px] md:leading-[21px] bg-light-black border border-solid border-t-0 border-x-0 border-grey transition ease-in-out focus:text-white focus:border-white focus:outline-none"
        placeholder="Search by name"
        aria-label="Search by name"
        @focus="isInputFocused = true"
        @blur="isInputFocused = false"
      />
      <button
        class="absolute right-0 bottom-[8px] md:bottom-[5px] grid place-items-center w-[24px] md:w-[32px] h-[24px] md:h-[32px] focus:outline-none"
        type="button"
      >
        <svg
          class="w-[18px] h-[18px] md:w-[24px] md:h-[24px]"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.6667 14.6667H15.6133L15.24 14.3067C16.5467 12.7867 17.3333 10.8133 17.3333 8.66667C17.3333 3.88 13.4533 0 8.66667 0C3.88 0 0 3.88 0 8.66667C0 13.4533 3.88 17.3333 8.66667 17.3333C10.8133 17.3333 12.7867 16.5467 14.3067 15.24L14.6667 15.6133V16.6667L21.3333 23.32L23.32 21.3333L16.6667 14.6667ZM8.66667 14.6667C5.34667 14.6667 2.66667 11.9867 2.66667 8.66667C2.66667 5.34667 5.34667 2.66667 8.66667 2.66667C11.9867 2.66667 14.6667 5.34667 14.6667 8.66667C14.6667 11.9867 11.9867 14.6667 8.66667 14.6667Z"
            :fill="isInputFocused ? '#fff' : '#808080'"
          />
        </svg>
      </button>
    </div>

    <div v-if="!searchLoading" class="grid grid-cols-none md:grid-cols-2 gap-[24px] md:gap-[24px]">
      <character-card
        v-for="(character, index) in characters"
        :key="`character_${index + 1}`"
        :character="character"
        @open-modal="openModal"
      />

      <load-more-observer v-if="nextPageUrl" @intersect="getCharacters(nextPageUrl)" />
    </div>

    <div v-else class="grid grid-cols-none md:grid-cols-2 gap-[24px] md:gap-[24px]">
      <character-skeleton-card v-for="i in 4" :key="`character-skeleton_${i}`" />
    </div>

    <Teleport to="#app">
      <Transition name="modal-wrapper-fade" mode="out-in" appear>
        <character-modal v-if="isModalOpened" :url="currentUrl" @close-modal="closeModal" />
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import { useCharactersStore } from "@/stores/characters";
import useDebouncedRef from "@/composables/use-debounced-ref";
import delay from "@/utils/delay";
import scrollLock from "@/utils/scroll-lock";
import CharacterSkeletonCard from "@/components/CharacterSkeletonCard.vue";

const CharacterCard = defineAsyncComponent(() => import("@/components/CharacterCard.vue"));
const CharacterModal = defineAsyncComponent(() => import("@/components/CharacterModal.vue"));
const LoadMoreObserver = defineAsyncComponent(() => import("@/components/LoadMoreObserver.vue"));

const { characters, nextPageUrl } = storeToRefs(useCharactersStore());
const { getCharacters, searchCharacter, clearCharacters, clearCharacter } = useCharactersStore();

const searchLoading: Ref<boolean> = ref(false);
const searchStr: Ref<string> = useDebouncedRef("", 1500, false) as Ref<string>;
const isInputFocused: Ref<boolean> = ref(false);
const currentUrl: Ref<string> = ref("");
const isModalOpened: Ref<boolean> = ref(false);

const openModal = (url: string): void => {
  currentUrl.value = url;
  isModalOpened.value = true;

  scrollLock.enable();
};

const closeModal = (): void => {
  isModalOpened.value = false;

  scrollLock.disable();
  clearCharacter();
};

const searchCharacterHandler = async (str: string) => {
  searchLoading.value = true;

  await delay(2000);
  await searchCharacter(str);

  searchLoading.value = false;
};

watch(searchStr, val => {
  if (!val) {
    clearCharacters();
    getCharacters();
    return;
  }

  searchCharacterHandler(val as string);
});

await delay(2000);
await getCharacters();
</script>

<style scoped>
.modal-wrapper-fade-enter-active,
.modal-wrapper-fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.modal-wrapper-fade-enter-from,
.modal-wrapper-fade-leave-to {
  opacity: 0;
}
</style>
