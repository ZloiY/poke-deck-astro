import { useStore } from "effector-react";
import { useEffect, useState } from "react";
import { trpcReact } from "src/api";

import { ReactComponent as Remove } from "@icons/close-circle.svg";
import type { Deck } from "@prisma/client";

import {
  $selectedPokemons,
  removePokemon,
  resetPokemons,
  useMessageBus,
  useModalState,
} from "../../hooks";
import { Button } from "../Button";
import { DeckCard, PreviewCard } from "../Cards";
import { Loader } from "../Loader";
import { Select } from "../Select";
import { ModalContainer } from "./ModalContainer";

export const AddCards = ({
  deckId,
  onSubmit,
}: {
  deckId?: string | null;
  onSubmit?: () => void;
}) => {
  const pokemons = useStore($selectedPokemons);
  const { data: deck, isLoading } = trpcReact.deck.getUserDeckById.useQuery({
    deckId,
  });
  const { data: userDecks, isLoading: decksLoading } =
    trpcReact.deck.getEmptyUserDecks.useQuery({
      numberOfEmptySlots: 20,
    });
  const addCardsToDecks = trpcReact.deck.addCardsToDecks.useMutation();
  const [showModal, { closeModal, openModal }] = useModalState();
  const [selectedDeck, setSelectedDeck] = useState(deck);
  const { pushMessage } = useMessageBus();
  //  const transitions = useTransition(showModal ? pokemons : [], {
  //    trail: 400 / pokemons.length,
  //    keys: (pokemon) => pokemon.name,
  //    from: { opacity: 0, scale: 0 },
  //    enter: { opacity: 1, scale: 1 },
  //    config: config.stiff,
  //  });

  useEffect(() => {
    if (deck) {
      setSelectedDeck(deck);
    }
  }, [deck]);

  useEffect(() => {
    if (pokemons.length == 0) {
      closeModal();
    }
  }, [pokemons.length]);

  const updateDeck = (onClose: () => void) => () => {
    if (selectedDeck) {
      addCardsToDecks
        .mutateAsync({
          decksIds: [selectedDeck.id],
          cards: pokemons.map((pokemon) => ({
            name: pokemon.name,
            imageUrl:
              pokemon.sprites.other?.["official-artwork"].front_default ??
              pokemon.sprites.front_default ??
              "",
          })),
        })
        .then(pushMessage)
        .then(resetPokemons)
        .then(onSubmit)
        .then(onClose)
        .then(() => {
          location.assign(`/pokemons/${selectedDeck.id}`);
        })
        .catch(pushMessage);
    }
  };

  return (
    <ModalContainer title="Add cards to the decks">
      {(onClose) => (
        <div className="flex flex-col gap-5 min-w-[450px] max-w-[720px] px-2 pb-4">
          <div className="flex gap-10 w-full px-1">
            <Loader className="text-white" isLoading={isLoading}>
              <>
                {selectedDeck && (
                  <DeckCard
                    className="w-32 h-52 border-yellow-500 border-2"
                    notInteractive={true}
                    deck={selectedDeck}
                  />
                )}
                {(userDecks?.length ?? 0) > 0 && (
                  <Select
                    className="w-64"
                    placeholder="Select deck..."
                    label="Select deck where you want to add Pokemons"
                    onSelect={setSelectedDeck}
                    showItemName={(deck) => deck.name} 
                    items={userDecks}
                  />
                )}
              </>
            </Loader>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {pokemons.map((pokemon) => (
              <div className="relative">
                <PreviewCard
                  className="w-32 h-52 text-xl border-yellow-500 border-2"
                  pokemon={pokemon}
                  notInteractive={true}
                />
                <Remove
                  className="absolute top-1 right-1 w-10 h-10 text-red-600 hover:text-red-400 active:text-red-500 active:scale-90 cursor-pointer"
                  onClick={() => removePokemon(pokemon)}
                />
              </div>
            ))}
          </div>
          <Button
            isLoading={addCardsToDecks.isLoading}
            className="bg-green-500 w-full h-12"
            disabled={!selectedDeck}
            onClick={updateDeck(onClose)}
          >
            Add Cards!
          </Button>
        </div>
      )}
    </ModalContainer>
  );
};
