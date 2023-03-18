import { createApi, createEvent, createStore } from "effector";
import type { Pokemon } from "pokenode-ts";

type SelectedPokemons = Pokemon[];

export const $selectedPokemons = createStore<SelectedPokemons>([]);
export const resetPokemons = createEvent();
$selectedPokemons.reset(resetPokemons);

export const { pushPokemon, removePokemon } = createApi($selectedPokemons, {
  pushPokemon: (pokemons, pokemon: Pokemon) => [...pokemons, pokemon],
  removePokemon: (pokemons, pokemon: { name: string }) =>
    pokemons.filter((selPokemon) => selPokemon.name != pokemon.name),
});
