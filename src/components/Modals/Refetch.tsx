import { createEvent, createStore } from "effector";
import { useEffect } from "react";

import { ReactComponent as Loader } from "@icons/loader.svg";

import { ModalContainer } from "./ModalContainer";

const refetchState = createStore(false);
const toggleModal = createEvent<boolean>();
refetchState.on(toggleModal, (_, value) => value);

export const Refetch = ({
  isRefetching,
  anotherState,
}: {
  isRefetching: boolean;
  anotherState?: typeof refetchState;
}) => {
  useEffect(() => {
    toggleModal(isRefetching);
  }, [isRefetching]);

  return (
    <ModalContainer anotherState={anotherState ?? refetchState}>
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
