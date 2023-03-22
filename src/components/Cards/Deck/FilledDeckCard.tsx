import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { LazyMotion, domAnimation, m } from "framer-motion";

import { ReactComponent as Add } from "@icons/add-card.svg";
import { ReactComponent as Delete } from "@icons/delete.svg";
import { ReactComponent as Private } from "@icons/private.svg";
import type { Deck } from "@prisma/client";

import { Loader } from "../../Loader";
import { PreviewCard } from "../PreviewCard";
import { BlankDeckCard } from "./BlankDeckCard";
import { trpcReact } from "src/api";

const getFirstSix = <T extends any>(arr: T[]): T[] => {
  const counter = 6;
  const getOne = (counter: number, result: T[], tail: T[]): T[] => {
    if (counter == 0 || !tail[0]) {
      return result;
    } else {
      const [head, ...newTail] = tail;
      return getOne(--counter, [...result, head], newTail);
    }
  };
  return getOne(counter, [], arr);
};

const getRandomShift = () => Math.ceil(Math.random() * 10 - 5);

export const FilledDeckCard = ({
  deck,
  removeDeck,
  addCard,
  className,
  notInteractive,
  onClick,
}: DeckCard<Deck & { username?: string }>) => {
  const { data: pokemons, isLoading } =
    trpcReact.pokemon.getPokemonsByDeckId.useQuery(deck.id);
  const [isHovered, toggleHovered] = useState(false);

  const firstSixOrLess = useMemo(
    () => (pokemons ? getFirstSix(pokemons) : []),
    [pokemons],
  );
  
  const translateY = (index: number) => isHovered
    ? (-1 * index ** 2 + (firstSixOrLess.length - 1) * index) * -15
    : index * (notInteractive ? -4 : -10)

  const translateX = (index: number) => isHovered
    ? -150 + (index / (firstSixOrLess.length - 1)) * 300
    : 0;

  const rotate = (index: number) => isHovered
    ? (-60 *firstSixOrLess.length) / 6 + ((index / (firstSixOrLess.length - 1)) * 120 * firstSixOrLess.length) / 6
    : index * getRandomShift();

  const mouseEntered = () => {
    toggleHovered(true);
  };

  const mouseLeft = () => {
    toggleHovered(false);
  };

  const goToTheDeck = () => {
    //    if (session.data?.user?.id == deck.userId) {
    //      router.push({
    //        pathname: "/pokemons/[deckId]",
    //        query: { deckId: deck.id },
    //      });
    //    }
  };

  return (
    <BlankDeckCard
      className={className}
      notInteractive={notInteractive}
      onClick={() => onClick?.(deck.id)}
    >
      {!deck.isFull && addCard && (
        <Add
          role="button"
          className="absolute top-2 left-1 w-14 h-14 text-white hover:text-yellow-400 active:text-yellow-500 active:scale-90 cursor-pointer"
          onClick={() => addCard?.(deck.id)}
        />
      )}
      {deck.private && (
        <Private
          className={twMerge(
            "absolute top-2 right-1 text-white w-14 h-14",
            notInteractive && "top-1 right-0 w-5 h-5",
          )}
        />
      )}
      <div
        role="button"
        className={twMerge(
          "flex flex-col gap-5 justify-between items-center h-full",
          notInteractive && "gap-2 justify-end",
        )}
        onClick={goToTheDeck}
      >
        <Loader isLoading={isLoading}>
          <LazyMotion features={domAnimation}>
            <div
              className={twMerge(
                "relative mt-20 w-40 h-60",
                notInteractive && "mt-0 mb-10 w-10 h-16",
              )}
              onMouseEnter={mouseEntered}
              onMouseLeave={mouseLeft}
            >
              {firstSixOrLess.map((decks, index) => (
                <m.div
                  key={decks.name}
                  className="absolute"
                  animate={{
                    y: translateY(index), 
                    x: translateX(index), 
                    rotate: rotate(index),
                    zIndex: isHovered ? 2 : 1,
                  }}
                >
                  <PreviewCard
                    className={twMerge(
                      "w-40 h-60 pb-0 text-xl border-2 rounded-xl border-yellow-500",
                      notInteractive && "w-14 h-24 text-xs border",
                    )}
                    pokemon={decks}
                    nameOnSide={isHovered}
                    notInteractive
                  />
                </m.div>
              ))}
            </div>
            {deck.username && (
              <p className="text-2xl">Owner: {deck.username}</p>
            )}
            <p className={twMerge("text-2xl", notInteractive && "text-base")}>
              {deck.name}
            </p>
            <p className={twMerge("text-xl", notInteractive && "text-sm")}>
              {deck.deckLength}/{import.meta.env.PUBLIC_DECK_MAX_SIZE}
            </p>
          </LazyMotion>
        </Loader>
      </div>
      {removeDeck && (
        <Delete
          role="button"
          className="absolute right-1 bottom-2 w-14 h-14 text-red-700 hover:text-red-500 active:text-red-600 active:scale-90"
          onClick={() => removeDeck?.(deck.id)}
        />
      )}
    </BlankDeckCard>
  );
};
