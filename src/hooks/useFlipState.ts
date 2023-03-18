import { createApi, createStore } from "effector";
import { useStore } from "effector-react";
import { useMemo } from "react";

const $flipState = createStore<FlipState>("Preview");
const { toggle, showDetails, showPreview } = createApi($flipState, {
  toggle: (state) => (state == "Preview" ? "Details" : "Preview"),
  showDetails: () => "Details",
  showPreview: () => "Preview",
});

export const useFlipState = () => {
  const flipState = useStore($flipState);

  return useMemo(
    () => ({ flipState, toggle, showPreview, showDetails }),
    [flipState],
  );
};
