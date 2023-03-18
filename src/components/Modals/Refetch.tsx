import { createEvent, createStore } from "effector";
import { useEffect } from "react";

import { ReactComponent as Loader } from "@icons/loader.svg";

import { ModalContainer } from "./ModalContainer";

const refetchStateAtom = createStore(false)
const toggleModal = createEvent<boolean>();
refetchStateAtom.on(toggleModal, (_, value) => value);

export const Refetch = ({ isRefetching, anotherAtom }: { isRefetching: boolean, anotherAtom?: typeof refetchStateAtom }) => {

  useEffect(() => {
    toggleModal(isRefetching);
  }, [isRefetching]);

  return (
    <ModalContainer anotherAtom={anotherAtom ?? refetchStateAtom}>
      {() => (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin">
            <Loader className="text-orange-500 h-40 w-40" />
          </div>
        </div>
      )}
    </ModalContainer>
  );
};
