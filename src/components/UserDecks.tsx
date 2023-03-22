import { useEffect, useMemo, useRef } from "react";
import { trpcReact } from "src/api";

import { useVirtualizer } from "@tanstack/react-virtual";

import { useMessageBus, useModalState } from "../hooks";
import { AddDeckCard } from "./Cards";
import { DeckCard } from "./Cards/Deck/DeckCard";
import { Loader } from "./Loader";
import { CreateDeck } from "./Modals";
import { TRPCWrapper } from "./TRPCWrapper";

const UnwrappedUserDecks = () => {
  const [_, { openModal }] = useModalState();
  const createDeck = trpcReact.deck.createDeck.useMutation();
  const removeDeck = trpcReact.deck.removeUserDeck.useMutation();
  const parent = useRef(null);
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = trpcReact.deck.getUserDecks.useInfiniteQuery(
    { limit: 4 },
    {
      getNextPageParam: (last) => last.nextCursor,
    },
  );
  const userDecks = useMemo(
    () => data?.pages.flatMap((group) => group.decks) ?? [],
    [data?.pages],
  );

  const { pushMessage } = useMessageBus();

  const virtualColumn = useVirtualizer({
    horizontal: true,
    count: false ? userDecks?.length + 1 : userDecks?.length,
    getScrollElement: () => parent.current,
    estimateSize: () => 320,
    overscan: 4,
  });

  useEffect(() => {
    const [lastItem] = [...virtualColumn.getVirtualItems()].reverse();
    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= userDecks.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    virtualColumn.getVirtualItems(),
    userDecks.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  const create = async (params: CreateDeckParams) => {
    const message = await createDeck.mutateAsync(params);
    pushMessage(message);
    refetch();
  };

  const remove = async (id: string) => {
    const message = await removeDeck.mutateAsync(id);
    pushMessage(message);
    refetch();
  };

  const addPokemons = (deckId: string) => {
    location.assign(`/home?deckId=${deckId}`);
  };

  return (
    <>
      <CreateDeck create={create} isLoading={createDeck.isLoading} />
      <div className="border-2 rounded-xl border-purple-900 bg-purple-800/60 p-2 pb-0 relative w-full">
        {(removeDeck.isLoading || createDeck.isLoading) && (
          <div className="backdrop-blur-md flex justify-center items-center absolute top-0 left-0 w-full h-full z-50">
            <Loader className="w-60 h-60 text-orange-500" isLoading />
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="font-coiny text-3xl">Your Decks:</span>
          <span className="font-coiny text-3xl font-normal">
            {userDecks?.length}/{import.meta.env.PUBLIC_USER_MAX_DECKS}
          </span>
        </div>
        <div
          id="scroll-div"
          ref={parent}
          className="w-full h-[520px] flex gap-5 overflow-x-scroll overflow-y-hidden pb-4 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent"
        >
          {userDecks?.length != +import.meta.env.PUBLIC_USER_MAX_DECKS && (
            <AddDeckCard onClick={openModal} />
          )}
          <Loader className="w-60 h-60" isLoading={isLoading}>
            <div
              className="h-full relative text-center text-3xl"
              style={{ width: `${virtualColumn.getTotalSize()}px` }}
            >
              {virtualColumn.getVirtualItems().map((virtualItem) => (
                <div
                  key={virtualItem.index}
                  className="h-full"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${virtualItem.size}px`,
                    transform: `translateX(${virtualItem.start}px)`,
                  }}
                >
                  <DeckCard
                    deck={userDecks[virtualItem.index]!}
                    addCard={addPokemons}
                    removeDeck={remove}
                  />
                </div>
              ))}
            </div>
          </Loader>
        </div>
      </div>
    </>
  );
};

export const UserDecks = TRPCWrapper(UnwrappedUserDecks);
