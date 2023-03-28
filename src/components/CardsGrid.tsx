import { m } from "framer-motion";
import type { Pokemon } from "pokenode-ts";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { useLoadingState } from "../hooks";

export const cardGridStyles = `grid gap-y-10 gap-x-5 min-[1880px]:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4lg
lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 items-center justify-items-center`;

export const CardsGrid = <P extends Pokemon>({
  pokemons = [],
  paginationState,
  children,
}: {
  pokemons?: P[];
  paginationState: PaginationState;
  children: <T extends { pokemon: Pokemon }>(
    pokemon: Pokemon,
    index: number,
  ) => ReactElement<T>;
}) => {
  const loadingState = useLoadingState();

  const left = useCallback(() => {
    switch (true) {
      case loadingState == "Hold" && paginationState == "Next": {
        return -5000;
      }
      case loadingState == "Hold" && paginationState == "Prev": {
        return 5000;
      }
      case loadingState == "Finished": {
        return 0;
      }
    }
  }, [loadingState, paginationState]);

  return (
    <div className="h-full relative">
      <m.div
        style={{
          x: 0,
          position: loadingState == "Hold" ? "static" : "absolute",
        }}
        animate={{
          x: left(),
        }}
        transition={{
          duration: 12.5,
          type: "spring",
          mass: 11,
          stiffness: 100,
          bounce: 20,
        }}
        className={twMerge("w-full mt-5", cardGridStyles)}
      >
        {pokemons.map((pokemon, index) => children(pokemon, index))}
      </m.div>
    </div>
  );
};
