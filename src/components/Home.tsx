import { useStore } from "effector-react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { trpcReact } from "src/api";

import { ReactComponent as Check } from "@icons/check.svg";

import { FlipCard } from "../components/Cards";
import { CardsGrid } from "../components/CardsGrid";
import { AddCards, CreateDeck, Refetch } from "../components/Modals";
import { PaginationButtons } from "../components/PaginationButtons";
import { SearchBar } from "../components/SearchBar";
import {
  $selectedPokemons,
  resetPokemons,
  useAuth,
  useFlipState,
  useMessageBus,
  useModalState,
  usePagination,
} from "../hooks";
import { TRPCWrapper } from "./TRPCWrapper";

const FixedButton = ({
  onClick,
  existingPokemonsLength,
}: {
  onClick: () => void;
  existingPokemonsLength: number;
}) => {
  const [entered, toggleEnter] = useState(false);
  const pokemons = useStore($selectedPokemons);

  return pokemons.length > 0 ? (
    <div
      role="button"
      onMouseEnter={() => toggleEnter(true)}
      onMouseLeave={() => toggleEnter(false)}
      className={`fixed right-2 bottom-2
      flex justify-center items-center rounded-full h-16 w-16 bg-white text-purple-900 text-2xl cursor-pointer
      hover:bg-green-500 hover:text-white transition-all z-50
      shadow-xl`}
      onClick={onClick}
    >
      {entered ? (
        <Check className="opacity-0 text-white hover:opacity-100 h-full w-full m-2" />
      ) : (
        <p className="text-lg">
          {pokemons.length + existingPokemonsLength}/
          {import.meta.env.PUBLIC_DECK_MAX_SIZE}
        </p>
      )}
    </div>
  ) : null;
};

const HomeUnwrapped = ({
  page,
  deckId,
  pokemons,
  search = "",
}: {
  deckId?: string;
  page: number;
  pokemons: [];
  search?: string;
}) => {
  const [_, { openModal }] = useModalState();
  const { flipState } = useFlipState();
  const [isRefetching, setRefetching] = useState(false);
  const pagination = usePagination({
    page,
    limit: 15,
    totalLength: 1275,
    onNextPage: (nextPage) => {
      const mayberQuery = location.href.split('?')[1]; 
      const queryParams = mayberQuery ? `?${mayberQuery}` : '';
      location.assign(`/home/${nextPage}${queryParams}`);
    },
    onPrevPage: (prevPage) => {
      const mayberQuery = location.href.split('?')[1]; 
      const queryParams = mayberQuery ? `?${mayberQuery}` : '';
      location.assign(`/home/${prevPage}${queryParams}`);
    },
  });
  const user = useAuth();
  const { pushMessage } = useMessageBus();
  const selectedPokemons = useStore($selectedPokemons);
  const { data: emptyDecks } = trpcReact.deck.getEmptyUserDecks.useQuery(
    { numberOfEmptySlots: 20 },
    { enabled: !!user },
  );
  const { data: pokemonsInDeck, refetch } =
    trpcReact.pokemon.getPokemonsByDeckId.useQuery(deckId ?? "", {
      enabled: !!deckId,
    });
  const { mutateAsync: createDeck, isLoading: deckCreating } =
    trpcReact.deck.createDeck.useMutation();

  const decksLength = useMemo(() => emptyDecks?.length ?? 0, [emptyDecks]);

  const createDeckWithCards = useCallback(
    (params: { name: string; private: boolean }) => {
      const cards = selectedPokemons.map((pokemon) => ({
        name: pokemon.name,
        imageUrl:
          pokemon.sprites.other?.["official-artwork"].front_default ??
          pokemon.sprites.front_default ??
          "",
      }));
      setRefetching(true);
      createDeck({ ...params, cards })
        .then((message) => {
          resetPokemons();
          pushMessage(message);
          setRefetching(false);
          location.assign(`/pokemons/deck/${message.deck?.id}`);
        })
    },
    [selectedPokemons],
  );

  const updateQuery = useCallback((search: string) => {
    if (search?.length > 0) location.assign(`/home?search=${search}`);
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      {(deckId || decksLength > 0) && (
        <AddCards deckId={deckId} onSubmit={refetch} />
      )}
      {decksLength == 0 && !deckId && (
        <CreateDeck create={createDeckWithCards} isLoading={deckCreating} />
      )}
      <FixedButton
        onClick={openModal}
        existingPokemonsLength={pokemonsInDeck?.length ?? 0}
      />
      <Refetch isRefetching={isRefetching}/>
      <div className="flex relative justify-center items-center">
        <SearchBar searchValue={search} onSearch={updateQuery} />
      </div>
      <PaginationButtons
        showNext={pagination.hasNextPage}
        showPrev={pagination.hasPrevPage}
        onNextPage={pagination.goToNextPage}
        onPrevPage={pagination.goToPrevPage}
      />
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          <CardsGrid
            paginationState={pagination.paginationState}
            pokemons={pokemons}
          >
            {(pokemon, index) => (
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
                  pokemon={pokemon}
                  selectedPokemons={selectedPokemons}
                  pokemonsInDeck={pokemonsInDeck}
                  keepFlipped={flipState}
                />
              </m.div>
            )}
          </CardsGrid>
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
};

export const Home =
  TRPCWrapper<Parameters<typeof HomeUnwrapped>[0]>(HomeUnwrapped);
