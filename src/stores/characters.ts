import type { Ref } from "vue";
import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { ICharactersResponse } from "@/ts/interfaces/characters-response";
import type { ICharacter } from "@/ts/interfaces/character";
import type { IPromiseResponse } from "@/ts/interfaces/promise-response";

export const useCharactersStore = defineStore("characters", () => {
  const characters: Ref<ICharacter[]> = ref([]);
  const nextPageUrl: Ref<string | null> = ref("");
  const character: Ref<ICharacter | null> = ref(null);
  const cachedCharacters: Ref<ICharacter[]> = ref([]);

  const getCharacters = async (url: string = "https://swapi.dev/api/people"): Promise<IPromiseResponse> => {
    try {
      const { data } = await axios.get<ICharactersResponse>(url);

      characters.value = [...characters.value, ...data.results];
      nextPageUrl.value = data.next;

      return { status: "success" };
    } catch (e) {
      return { status: "failed", message: "Error" };
    }
  };

  const getCharacter = async (url: string): Promise<IPromiseResponse> => {
    try {
      const { data } = await axios.get<ICharacter>(`${url}`);
      character.value = data;

      // getting of homeworld info
      const homeworld = await axios.get(character.value?.homeworld).then(res => res.data);
      character.value.homeworld = homeworld.name;

      // getting of films info
      character.value.films = await axios
        .all(character.value.films.map(url => axios.get(url)))
        .then(res => res.map(r => r.data))
        .then(data => data.map(film => film.title));

      // getting of species info
      character.value.species = await axios
        .all(character.value.species.map(url => axios.get(url as string)))
        .then(res => res.map(r => r.data))
        .then(data => data.map(specie => specie.name));

      return { status: "success" };
    } catch (e) {
      return { status: "failed", message: "Error" };
    }
  };

  const searchCharacter = async (searchStr: string) => {
    try {
      characters.value = [];
      nextPageUrl.value = null;

      const { data } = await axios.get<ICharactersResponse>(`https://swapi.dev/api/people?search=${searchStr}`);

      characters.value = data.results;
      return { status: "success" };
    } catch (e) {
      return { status: "failed", message: "Error" };
    }
  };

  const isVisited = (character: ICharacter): boolean => !!cachedCharacters.value.find(c => c.url === character.url);

  const clearCharacters = (): void => {
    characters.value = [];
  };

  const clearCharacter = (): void => {
    character.value = null;
  };

  return {
    characters,
    nextPageUrl,
    character,
    getCharacters,
    getCharacter,
    searchCharacter,
    clearCharacters,
    clearCharacter,
  };
});
