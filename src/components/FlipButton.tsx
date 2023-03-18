import { twMerge } from "tailwind-merge";

import { ReactComponent as Flip } from "@icons/flip.svg";
import { useFlipState } from "src/hooks";

export const FlipButton = () => {
  const { flipState, toggle } = useFlipState();
  return (
    <Flip
      role="button"
      className={twMerge(
        "text-white transition-transform duration-200 hover:text-yellow-400 cursor-pointer right-0 z-50 lg:w-10 lg:h-10 min-[580px]:w-16 min-[580px]:h-16 w-12 h-12",
        flipState == 'Details' && "text-yellow-500 rotate-180",
      )}
      onClick={() => toggle()}
    />
  );
};
