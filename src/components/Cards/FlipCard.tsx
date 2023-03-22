import { LazyMotion, domAnimation, m } from "framer-motion";
import { memo, useEffect, useMemo, useState } from "react";

import { DetailsCard } from "./DetailsCard";
import { PreviewCard } from "./PreviewCard";

type FlipCardProps = Parameters<typeof DetailsCard>[0] &
  Parameters<typeof PreviewCard>[0] & { keepFlipped?: FlipState };

export const FlipCard = memo(
  ({
    pokemon,
    keepFlipped = "Preview",
    selectedPokemons = [],
    pokemonsInDeck = [],
    removeFromDeck,
  }: FlipCardProps) => {
    const isSelected = useMemo(
      () =>
        !![...selectedPokemons, ...pokemonsInDeck].find(
          (selectedPokemon) => selectedPokemon.name == pokemon.name,
        ),
      [selectedPokemons, pokemonsInDeck, pokemon.name],
    );
    const [isHovered, toggleHovered] = useState<FlipState>(() =>
      isSelected ? "Details" : keepFlipped,
    );

    useEffect(() => {
      toggleHovered(isSelected ? "Details" : keepFlipped);
    }, [keepFlipped, isSelected]);

    const unHover = () => {
      if (keepFlipped != "Details" && !isSelected) {
        toggleHovered("Preview");
      }
    };

    return (
      <LazyMotion features={domAnimation}>
        <div
          className="relative"
          onMouseEnter={() => toggleHovered("Details")}
          onMouseLeave={unHover}
        >
          <m.div
            className="z-10"
            initial={{ opacity: 1, rotateY: 0 }}
            animate={{
              opacity: isHovered == "Preview" ? 1 : 0,
              perspective: "600px",
              rotateY: isHovered == "Details" ? 180 : 0,
            }}
            transition={{
              duration: 0.5,
              type: "spring",
              mass: 2,
              stiffness: 60,
            }}
          >
            <PreviewCard pokemon={pokemon} />
          </m.div>
          <m.div
            className="absolute top-0 z-30"
            initial={{ opacity: 0, rotateY: 180 }}
            animate={{
              opacity: isHovered == "Details" ? 1 : 0,
              perspective: "600px",
              rotateY: isHovered == "Preview" ? 180 : 0,
            }}
            transition={{
              duration: 0.5,
              type: "spring",
              mass: 2,
              stiffness: 60,
            }}
          >
            <DetailsCard
              pokemon={pokemon}
              selectedPokemons={selectedPokemons}
              isSelected={isSelected}
              pokemonsInDeck={pokemonsInDeck}
              removeFromDeck={removeFromDeck}
            />
          </m.div>
        </div>
      </LazyMotion>
    );
  },
);
