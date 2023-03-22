import { twMerge } from "tailwind-merge";

import { DetailsCard } from "./Cards";
import { cardGridStyles } from "./CardsGrid";
import { Loader } from "./Loader";
import { TRPCWrapper } from "./TRPCWrapper";
import { trpcReact } from "../api";

const UnwrappedOtherUserDeck = ({ deckId }: { deckId: string }) => {
  const { data: pokemons, isLoading } =
    trpcReact.pokemon.getPokemonDetailedList.useQuery(deckId);
  const { data: deck } = trpcReact.deck.getDeckById.useQuery(deckId);

  return (
    <div className={twMerge("mt-5 flex flex-col gap-5", isLoading && "items-center justify-center")}>
      <div className="flex justify-between gap-5 text-3xl font-coiny text-white">
        <span>Owner: {deck?.username ?? "..."}</span>
        <span>Deck name: {deck?.name ?? "..."}</span>
        <span>
          Deck size: {deck?.deckLength ?? "..."}/{import.meta.env.PUBLIC_DECK_MAX_SIZE}
        </span>
      </div>
      <Loader className="w-96 h-96" isLoading={isLoading}>
        <div className={twMerge("mt-5", cardGridStyles)}>
          {pokemons?.map((pokemon) => (
            <DetailsCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      </Loader>
    </div>
  );
};

export const OtherUserDeck = TRPCWrapper(UnwrappedOtherUserDeck);
