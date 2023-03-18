import { memo, useEffect, useMemo, useState } from "react";

import { DetailsCard } from "./DetailsCard";
import { PreviewCard } from "./PreviewCard";

type FlipCardProps =
  Parameters<typeof DetailsCard>[0]
  & Parameters<typeof PreviewCard>[0]
  & { keepFlipped?: FlipState }

export const FlipCard = memo(
  ({
    pokemon,
    keepFlipped = "Preview",
    selectedPokemons = [],
    pokemonsInDeck = [],
    removeFromDeck
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

//    const { transform, opacity } = useSpring({
//      opacity: isHovered == "Details" ? 1 : 0,
//      transform: `perspective(600px) rotateY(${
//        isHovered == "Details" ? 180 : 0
//      }deg)`,
//      config: { mass: 8, tension: 550, friction: 80 },
//    });

    const unHover = () => {
      if (keepFlipped != "Details" && !isSelected) {
        toggleHovered("Preview");
      }
    };

    return (
      <div
        className="relative"
        onMouseEnter={() => toggleHovered("Details")}
        onMouseLeave={unHover}
      >
        <div
          className="z-10"
        >
          <PreviewCard pokemon={pokemon} />
        </div>
        <div
          className="absolute top-0 z-30"
        >
          <DetailsCard
            pokemon={pokemon}
            selectedPokemons={selectedPokemons}
            isSelected={isSelected}
            pokemonsInDeck={pokemonsInDeck}
            removeFromDeck={removeFromDeck} />
        </div>
      </div>
    );
  },
);
