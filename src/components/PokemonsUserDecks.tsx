import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { useCallback, useMemo } from "react";

import { trpcReact } from "../api";
import { useModalState } from "../hooks";
import { AddDeckCard, DeckCard } from "./Cards";
import { Loader } from "./Loader";
import { CreateDeck, Refetch } from "./Modals";
import { TRPCWrapper } from "./TRPCWrapper";

const animationVariants = {
  entrance: { opacity: 1, scale: 1 },
  rotate: { rotateY: 0, perspective: 300 },
};

const UnwrapedDecks = () => {
  const { data, isLoading, isRefetching, refetch } =
    trpcReact.deck.getUserDecks.useQuery({ limit: null });
  const removeDeck = trpcReact.deck.removeUserDeck.useMutation();
  const createDeck = trpcReact.deck.createDeck.useMutation();
  const decks = useMemo(() => data?.decks ?? [], [data?.decks]);

  const [_, showModal] = useModalState();

  const removeUserDeck = async (deckId: string) => {
    await removeDeck.mutateAsync(deckId);
    refetch();
  };

  const addCardsToDeck = (deckId: string) => {
    location.assign(`/home/${deckId}`);
  };

  const addDeck = useCallback(async (params: CreateDeckParams) => {
    await createDeck.mutateAsync(params);
    refetch();
  }, []);

  return (
    <div className="flex flex-col w-full h-full px-5 justify-center items-center">
      <Refetch
        isRefetching={
          !isLoading &&
          (removeDeck.isLoading || createDeck.isLoading || isRefetching)
        }
      />
      <CreateDeck create={addDeck} />
      <Loader className="h-96 w-96 mt-40" isLoading={isLoading}>
        <>
          <p className="font-coiny text-3xl mt-4 w-full text-end">
            Total Decks Amount: {decks?.length}/
            {import.meta.env.PUBLIC_USER_MAX_DECKS}
          </p>
          <div
            className="w-full justify-items-center grid gap-y-10 gap-x-5 min-[1880px]:grid-cols-6 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2
mt-5"
          >
            <AddDeckCard onClick={showModal.openModal} />
            <LazyMotion features={domAnimation}>
              <AnimatePresence>
                {decks.map((deck, index) => (
                  <m.div
                    key={deck.id}
                    initial={{
                      opacity: 0,
                      scale: 0,
                      rotateY: 180,
                      perspective: "600px",
                    }}
                    animate={["entrance", "rotate"]}
                    variants={animationVariants}
                    transition={{
                      duration: 0.1,
                      type: "spring",
                      stiffness: 200,
                      delay: 0.15 * index,
                    }}
                  >
                    <DeckCard
                      deck={deck}
                      addCard={addCardsToDeck}
                      removeDeck={removeUserDeck}
                    />
                  </m.div>
                ))}
              </AnimatePresence>
            </LazyMotion>
          </div>
        </>
      </Loader>
    </div>
  );
};

export const PokemonsUserDecks = TRPCWrapper(UnwrapedDecks);
