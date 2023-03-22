import type { Pokemon } from "pokenode-ts";
import { memo, useCallback, useMemo, useState } from "react";
import { pushPokemon, removePokemon, useAuth } from "src/hooks";
import { twMerge } from "tailwind-merge";

import { ReactComponent as Add } from "@icons/add.svg";
import { ReactComponent as Remove } from "@icons/close-circle.svg";
import { ReactComponent as Delete } from "@icons/delete.svg";
import type { Pokemon as PrismaPokemon } from "@prisma/client";

import { Switcher } from "../Switcher";
import { BlankCard } from "./BlankCard";

export const DetailsCard = memo(
  ({
    pokemon,
    isSelected = false,
    pokemonsInDeck = [],
    selectedPokemons = [],
    removeFromDeck,
  }: {
    pokemon: Pokemon;
    pokemonsInDeck?: PrismaPokemon[];
    selectedPokemons?: Pokemon[];
    isSelected?: boolean;
    removeFromDeck?: (pokemon: Pokemon) => void;
  }) => {
    const pokemonAdded = useMemo(
      () => !!selectedPokemons.find(({ name }) => name == pokemon.name),
      [selectedPokemons, pokemon],
    );
    const user = useAuth();

    const isDeckFull = useMemo(
      () =>
        selectedPokemons.length + pokemonsInDeck.length ==
        +import.meta.env.PUBLIC_DECK_MAX_SIZE,
      [selectedPokemons, pokemonsInDeck],
    );

    const sprites = useMemo(
      () =>
        [
          pokemon?.sprites.other?.["official-artwork"].front_default,
          pokemon?.sprites.other?.dream_world.front_default,
          pokemon?.sprites.other?.dream_world.front_female,
          pokemon?.sprites.other?.home.front_default,
          pokemon?.sprites.other?.home.front_female,
          pokemon?.sprites.front_default,
          pokemon?.sprites.front_female,
        ].filter((item) => !!item),
      [pokemon?.sprites],
    );
    const [spriteKey, setSpriteKey] = useState<number>(0);

    const switchSprite = useCallback(
      (direction: "prev" | "next") => () => {
        if (direction == "next") {
          const newKey = spriteKey + 1;
          if (newKey >= sprites.length) {
            setSpriteKey(0);
          } else {
            setSpriteKey(newKey);
          }
        } else {
          const newKey = spriteKey - 1;
          if (newKey < 0) {
            setSpriteKey(sprites.length - 1);
          } else {
            setSpriteKey(newKey);
          }
        }
      },
      [sprites, spriteKey],
    );

    const currentSprite = useMemo(
      () => sprites[spriteKey],
      [sprites, spriteKey],
    );

    return (
      <BlankCard
        className={twMerge(
          "transition-all",
          isSelected && "shadow-[0_0_15px_4px] shadow-orange-500 scale-105",
        )}
      >
        {isSelected
          ? pokemonAdded && (
              <Remove
                role="button"
                className="absolute top-2 left-2 h-7 w-7 cursor-pointer text-red-500 hover:text-red-400 z-10"
                onClick={() => removePokemon(pokemon)}
              />
            )
          : !removeFromDeck &&
            user &&
            !isDeckFull && (
              <Add
                role="button"
                className="absolute top-2 left-2 h-7 w-7 cursor-pointer text-white hover:text-yellow-500 z-10"
                onClick={() => pushPokemon(pokemon)}
              />
            )}
        {removeFromDeck && (
          <Delete
            role="button"
            className="absolute top-2 left-2 h-10 w-10 cursor-pointer text-red-700 hover:text-red-400 z-10"
            onClick={() => removeFromDeck(pokemon)}
          />
        )}
        <div className="relative h-full pb-4">
          <div className="flex h-full flex-col items-stretch justify-between gap-4 mt-2">
            <div className="flex gap-7">
              <div className="relative h-40 basis-40">
                <img src={currentSprite!} alt={`${pokemon.name} image`} />
                <div
                  className="absolute bottom-0 right-0
            text-white scale-75"
                >
                  <Switcher
                    onNext={switchSprite("next")}
                    onPrev={switchSprite("prev")}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-7">
                <span className="text-2xl capitalize">{pokemon.name}</span>
                <div className="flex flex-col gap-5">
                  <span className="text-xl">
                    Height:{" "}
                    <span className="text-yellow-500">
                      {pokemon.height ?? "..."}
                    </span>
                  </span>
                  <span className="text-xl">
                    Weight:{" "}
                    <span className="text-yellow-500">
                      {pokemon.weight ?? "..."}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div>
              <span className="text-xl">Abilities:</span>
              <div className="flex flex-wrap justify-between gap-1">
                {pokemon?.abilities.map((ability) => (
                  <span
                    key={ability.ability.name}
                    className="text-lg capitalize text-yellow-500"
                  >
                    {ability.ability.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="self-end">
              <span className="text-xl">Stats:</span>
              <div className="grid grid-cols-3 items-end gap-x-6 gap-y-4">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name}>
                    <span>{stat.stat.name}</span>
                    <div
                      className={twMerge(
                        "relative flex h-5 w-20 items-center justify-center border-2 border-orange-400 bg-transparent",
                        stat.base_stat > 100 && "border-0",
                      )}
                    >
                      <span className="z-10">{stat.base_stat}</span>
                      <div
                        className={twMerge(
                          "absolute top-0 left-0 h-full bg-orange-400",
                          stat.base_stat > 100 && "bg-red-500",
                        )}
                        style={{ width: `${stat.base_stat}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BlankCard>
    );
  },
);
