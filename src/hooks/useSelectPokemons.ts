import { createApi, createEvent, createStore } from "effector";
import type { Pokemon } from "pokenode-ts";

type SelectedPokemons = Pokemon[];

export const $selectedPokemons = createStore<SelectedPokemons>([]);
export const resetPokemons = createEvent();
$selectedPokemons.reset(resetPokemons);
if (typeof window !== 'undefined') {
  window.onbeforeunload = () => {
    sessionStorage.setItem("selectedPokemons", JSON.stringify($selectedPokemons.getState()))
  }
}

export const { pushPokemon, removePokemon } = createApi($selectedPokemons, {
    pushPokemon: (pokemons, pokemon: Pokemon) => [...pokemons, pokemon],
        removePokemon: (pokemons, pokemon: { name: string }) =>
    pokemons.filter((selPokemon) => selPokemon.name != pokemon.name),
});

if (typeof window !== 'undefined') {
  window.onload = () => {
    JSON.parse(sessionStorage.getItem("selectedPokemons") ?? "")
      .map(pushPokemon);
  }
}
