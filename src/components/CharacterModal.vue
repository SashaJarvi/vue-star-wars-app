<template>
  <div
    class="fixed top-0 right-0 grid place-items-center w-full h-full bg-modal-bg backdrop-blur-[15px]"
    @click.self="emit('close-modal')"
  >
    <transition name="modal-fade" mode="in-out" appear>
      <article
        class="relative max-w-none h-full sm:max-w-[600px] sm:h-auto md:max-w-[700px] lg:max-w-[800px] w-full p-[48px_24px_24px] md:p-[80px_80px_74px] bg-black sm:rounded-[8px] drop-shadow-[0px_10px_30px_rgba(0,0,0,0.4)]"
      >
        <button
          class="absolute top-[16px] right-[16px] grid place-items-center w-[24px] h-[24px]"
          @click="emit('close-modal')"
        >
          <close-icon />
        </button>

        <transition v-if="!isLoading" name="character-fade" mode="in-out" appear>
          <div>
            <div class="flex items-center gap-[16px] mb-[48px] md:mb-[80px]">
              <character-avatar v-if="character?.name" :name="character?.name" />

              <h2 class="text-white text-[22px] md:text-[26px] leading-[26px] md:leading-[28px] font-bold">
                {{ character?.name }}
              </h2>
            </div>

            <hr class="w-full mb-[46px] md:mb-[70px] border-2 border-grey" />

            <div class="grid grid-cols-none lg:grid-cols-[repeat(2,max-content)] gap-[16px] md:gap-x-[80px]">
              <div class="flex flex-col gap-[16px]">
                <div class="grid grid-cols-[115px,1fr] lg:grid-cols-[110px,1fr] gap-[24px] items-center">
                  <div class="flex items-center gap-[8px]">
                    <div class="grid place-items-center w-[24px] h-[24px]">
                      <birth-year-icon />
                    </div>

                    <p class="text-[16px] md:text-[18px] leading-[19px] md:leading-[21px]">Birth year</p>
                  </div>

                  <p class="text-white text-[16px] md:text-[18px] leading-[19px] md:leading-[21px] font-bold">
                    {{ character?.birth_year }}
                  </p>
                </div>
                <div class="grid grid-cols-[115px,1fr] lg:grid-cols-[110px,1fr] gap-[24px] items-center">
                  <div class="flex items-center gap-[8px]">
                    <div class="grid place-items-center w-[24px] h-[24px]">
                      <species-icon />
                    </div>

                    <p class="text-[16px] md:text-[18px] leading-[19px] md:leading-[21px]">Species</p>
                  </div>

                  <template v-if="character?.species.length"
                    ><p
                      v-for="specie in character?.species"
                      :key="specie"
                      class="text-white text-[16px] md:text-[18px] leading-[19px] md:leading-[21px] font-bold"
                    >
                      {{ specie }}
                    </p></template
                  >
                  <p v-else class="text-white text-[16px] md:text-[18px] leading-[19px] md:leading-[21px] font-bold">
                    —
                  </p>
                </div>
                <div class="grid grid-cols-[115px,1fr] lg:grid-cols-[110px,1fr] gap-[24px] items-center">
                  <div class="flex items-center gap-[8px]">
                    <div class="grid place-items-center w-[24px] h-[24px]">
                      <gender-icon />
                    </div>

                    <p class="text-[16px] md:text-[18px] leading-[19px] md:leading-[21px]">Gender</p>
                  </div>

                  <p class="text-white text-[16px] md:text-[18px] leading-[19px] md:leading-[21px] font-bold">
                    {{ character?.gender }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col gap-[16px]">
                <div class="grid grid-cols-[115px,1fr] lg:grid-cols-[125px,1fr] gap-[24px] items-center">
                  <div class="flex items-center gap-[8px]">
                    <div class="grid place-items-center w-[24px] h-[24px]">
                      <homeworld-icon />
                    </div>

                    <p class="text-[16px] md:text-[18px] leading-[19px] md:leading-[21px]">Homeworld</p>
                  </div>

                  <p class="text-white text-[16px] md:text-[18px] leading-[19px] md:leading-[21px] font-bold">
                    {{ character?.homeworld || "—" }}
                  </p>
                </div>
                <div class="grid grid-cols-[115px,1fr] lg:grid-cols-[125px,1fr] gap-[24px] items-start">
                  <div class="flex items-center gap-[8px]">
                    <div class="grid place-items-center w-[24px] h-[24px]">
                      <films-icon />
                    </div>

                    <p class="text-[16px] md:text-[18px] leading-[19px] md:leading-[21px]">Films</p>
                  </div>

                  <div class="col-span-1">
                    <p
                      v-for="film in character?.films"
                      :key="film"
                      class="text-white text-[16px] md:text-[18px] leading-[19px] md:leading-[21px] font-bold"
                    >
                      {{ film }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <div v-else class="grid place-items-center w-full h-full"><the-loader /></div>
      </article>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import { useCharactersStore } from "@/stores/characters";
import CharacterAvatar from "@/components/CharacterAvatar.vue";
import TheLoader from "@/components/TheLoader.vue";
import CloseIcon from "@/components/icons/CloseIcon.vue";
import BirthYearIcon from "@/components/icons/BirthYearIcon.vue";
import SpeciesIcon from "@/components/icons/SpeciesIcon.vue";
import GenderIcon from "@/components/icons/GenderIcon.vue";
import HomeworldIcon from "@/components/icons/HomeworldIcon.vue";
import FilmsIcon from "@/components/icons/FilmsIcon.vue";
import delay from "@/utils/delay";

const props = defineProps<{
  url: string;
}>();

const emit = defineEmits<{
  (e: "close-modal"): void;
}>();

const { character } = storeToRefs(useCharactersStore());
const { getCharacter } = useCharactersStore();

const isLoading: Ref<boolean> = ref(false);

const getCharacterHandler = async (): Promise<void> => {
  isLoading.value = true;

  await getCharacter(props.url);

  isLoading.value = false;
};

getCharacterHandler();
</script>

<style lang="scss" scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.5s ease-in-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

.character-fade-enter-active,
.character-fade-leave-active {
  transition: all 0.5s ease-in-out;
}

.character-fade-enter-from,
.character-fade-leave-to {
  opacity: 0;
  transform: scale(1.2);
}
</style>
