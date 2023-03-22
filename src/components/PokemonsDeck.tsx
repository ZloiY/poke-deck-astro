import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import type { Pokemon } from "pokenode-ts";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { trpcReact } from "../api";
import { useFlipState, useMessageBus } from "../hooks";
import { FlipCard } from "./Cards";
import { cardGridStyles } from "./CardsGrid";
import { Loader } from "./Loader";
import { Refetch } from "./Modals";
import { TRPCWrapper } from "./TRPCWrapper";

const UnwrapPokemonsDeck = ({ deckId = "" }: { deckId: string }) => {
  const {
    data: pokemonsDetails,
    isLoading,
    refetch,
    isRefetching,
  } = trpcReact.pokemon.getPokemonDetailedList.useQuery(deckId);
  const removePokemon = trpcReact.pokemon.removePokemonFromDeck.useMutation();
  const { pushMessage } = useMessageBus();

  const { flipState, showDetails } = useFlipState();

  useEffect(() => {
    showDetails();
    if (!isLoading && pokemonsDetails?.length == 0) {
      location.assign("/pokemons/decks");
    }
  }, [pokemonsDetails, isLoading]);

  const removePokemonFromDeck = async (pokemon: Pokemon) => {
    const message = await removePokemon.mutateAsync({
      deckId,
      pokemonName: pokemon.name,
    });
    pushMessage(message);
    await refetch();
  };

  return (
    <LazyMotion features={domAnimation}>
      <Refetch
        isRefetching={!isLoading && (isRefetching || removePokemon.isLoading)}
      />
      <Loader className="h-96 w-96 mt-20" isLoading={isLoading}>
        <div className={twMerge("w-full mt-5", cardGridStyles)}>
          <AnimatePresence>
            {pokemonsDetails?.map((pokemon, index) => (
              <m.div
                key={pokemon.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.1,
                  type: "spring",
                  stiffness: 80,
                  delay: index * 0.2,
                }}
              >
                <FlipCard
                  keepFlipped={flipState}
                  pokemon={pokemon}
                  removeFromDeck={removePokemonFromDeck}
                />
              </m.div>
            ))}
          </AnimatePresence>
        </div>
      </Loader>
    </LazyMotion>
  );
};

export const PokemonsDeck = TRPCWrapper(UnwrapPokemonsDeck);
