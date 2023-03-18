import { useStore } from "effector-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ReactComponent as Check } from "@icons/check.svg";

import { FlipCard } from "../components/Cards";
import { CardsGrid } from "../components/CardsGrid";
import { Loader } from "../components/Loader";
import { AddCards, CreateDeck } from "../components/Modals";
import { PaginationButtons } from "../components/PaginationButtons";
import { SearchBar } from "../components/SearchBar";
import {
    $selectedPokemons,
  resetPokemons,
  useFlipState,
  useMessageBus,
  useModalState,
  usePagination,
} from "../hooks";
import { trpcReact } from "src/api";
import { TRPCWrapper } from "./TRPCWrapper";

const FixedButton = ({ onClick, existingPokemonsLength }: { onClick: () => void, existingPokemonsLength: number }) => {
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
        <p className="text-lg">{pokemons.length + existingPokemonsLength}/{import.meta.env.PUBLIC_DECK_MAX_SIZE}</p>
      )}
    </div>
  ) : null;
};

const paginationParams = { page: 0, limit: 15, totalLength: 1275, onNextPage: () => {}, onPrevPage: () => {} };

const HomeUnwrapped = () => {
  const [_, showModal] = useModalState();
  const { flipState } = useFlipState();
  const pagination = usePagination(paginationParams);
  const { pushMessage } = useMessageBus();
  const selectedPokemons = useStore($selectedPokemons);
  const { data: decks } = trpcReact.deck.getEmptyUserDecks.useQuery({ numberOfEmptySlots: 20 });
  const { mutateAsync: createDeck, isLoading: deckCreating } =
    trpcReact.deck.createDeck.useMutation();
  const { data: pokemons, isLoading } = trpcReact.pokemon.getPokemonList.useQuery({
    searchQuery: "",
    offset: 0, 
    limit: 15
  });

  useEffect(() => {
      return () => { resetPokemons() }
  }, []);
  
  //const decksLength = useMemo(() => decks?.length ?? 0, [decks]);

 // const drag = useDrag(({ down, axis, delta: [x] }) => {
 //   if (down && axis == "x") {
 //     if (x > 0) {
 //       pagination.goToPrevPage();
 //     } else if (x < 0) {
 //       pagination.goToNextPage();
 //     }
 //   }
 // });

//  const createDeckWithCards = useCallback(
//    (params: { name: string; private: boolean }) => {
//      const cards = selectedPokemons.map((pokemon) => ({
//        name: pokemon.name,
//        imageUrl:
//          pokemon.sprites.other?.["official-artwork"].front_default ??
//          pokemon.sprites.front_default ??
//          "",
//      }));
//      createDeck({ ...params, cards })
//        .then((message) => {
//          location.assign(`/pokemons/deck/${message.deck?.id}`);
//          return message;
//        })
//        .then(pushMessage)
//        .then(resetPokemons);
//    },
//    [selectedPokemons],
//  );

  const updateQuery = useCallback(
    (search: string) => {
      if (search?.length > 0)
        location.assign("/home");
    },
    [],
  );

  return (
    <div className="flex flex-col h-full w-full mt-10">
      {/*{(props.deckId || decksLength > 0) && (
        <AddCards deckId={props.deckId} onSubmit={refetch} />
      )}
      {decksLength == 0 && !props.deckId && (
        <CreateDeck create={createDeckWithCards} isLoading={deckCreating} />
      )}
      <FixedButton onClick={showModal} existingPokemonsLength={pokemonsInDeck?.length ?? 0}/>
      */}
      <div className="flex relative justify-center items-center">
        <SearchBar searchValue={""} onSearch={updateQuery} />
      </div>
      <PaginationButtons
        showNext={pagination.hasNextPage}
        showPrev={pagination.hasPrevPage}
        onNextPage={pagination.goToNextPage}
        onPrevPage={pagination.goToPrevPage}
      />
       <Loader isLoading={isLoading}>
        <CardsGrid
          paginationState={pagination.paginationState}
          pokemons={pokemons}
        >
          {(pokemon) => (
            <FlipCard
              key={pokemon.id}
              pokemon={pokemon}
              selectedPokemons={selectedPokemons}
              pokemonsInDeck={[]}
              keepFlipped={flipState}
            />
          )}
        </CardsGrid>
      </Loader>
    </div>
  );
};

export const Home = TRPCWrapper(HomeUnwrapped);
