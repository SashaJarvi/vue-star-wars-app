import type { Ref } from "vue";
import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { ICharactersResponse } from "@/ts/interfaces/characters-response";
import type { ICharacter } from "@/ts/interfaces/character";
import type { IPromiseResponse } from "@/ts/interfaces/promise-response";
import delay from "@/utils/delay";

export const useCharactersStore = defineStore("characters", () => {
  const characters: Ref<ICharacter[]> = ref([]);
  const nextPageUrl: Ref<string> = ref("");
  const character: Ref<ICharacter | null> = ref(null);
  const visitedCharacters: Ref<ICharacter[]> = ref([]);

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

  const getCharacter = async (url: string): Promise<IPromiseResponse | void> => {
    if (checkIsVisited(url)) {
      character.value = visitedCharacters.value.find(c => c.url === url) as ICharacter;
      return;
    }

    await delay();

    try {
      const { data } = await axios.get<ICharacter>(`${url}`);
      const characterData = data;

      // getting of homeworld info
      const homeworld = await axios.get(characterData?.homeworld).then(res => res.data);
      characterData.homeworld = homeworld.name;

      // getting of films info
      characterData.films = await axios
        .all(characterData.films.map(url => axios.get(url)))
        .then(res => res.map(r => r.data))
        .then(data => data.map(film => film.title));

      // getting of species info
      characterData.species = await axios
        .all(characterData.species.map(url => axios.get(url as string)))
        .then(res => res.map(r => r.data))
        .then(data => data.map(specie => specie.name));

      character.value = characterData;
      visitedCharacters.value.push(character.value);

      return { status: "success" };
    } catch (e) {
      return { status: "failed", message: "Error" };
    }
  };

  const searchCharacter = async (searchStr: string) => {
    try {
      characters.value = [];
      nextPageUrl.value = "";

      const { data } = await axios.get<ICharactersResponse>(`https://swapi.dev/api/people?search=${searchStr}`);

      characters.value = data.results;
      return { status: "success" };
    } catch (e) {
      return { status: "failed", message: "Error" };
    }
  };

  const clearCharacters = (): void => {
    characters.value = [];
  };

  const clearCharacter = (): void => {
    character.value = null;
  };

  const checkIsVisited = (url: string): boolean => {
    return !!visitedCharacters.value.find(c => c.url === url);
  };

  return {
    characters,
    nextPageUrl,
    character,
    visitedCharacters,
    getCharacters,
    getCharacter,
    searchCharacter,
    clearCharacters,
    clearCharacter,
  };
});
