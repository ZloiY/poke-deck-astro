import { createApi, createStore } from "effector";
import { useStore } from "effector-react";
import { useEffect, useState } from "react";

const $modalVisible = createStore(false);
const injectStore = (store: typeof $modalVisible = $modalVisible) =>
  createApi(store, {
    openModal: () => true,
    closeModal: () => false,
  });

export const useModalState = (
  $modalStore?: typeof $modalVisible,
  showOnMount?: boolean,
) => {
  const isModalShown = useStore($modalStore ?? $modalVisible);
  const [api] = useState(injectStore($modalStore));

  useEffect(() => {
    if (showOnMount) {
      api.openModal();
    }
  }, []);

  return [isModalShown, api] as const;
};
