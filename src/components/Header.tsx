import { twMerge } from "tailwind-merge";
import { useState } from "react";

import { ReactComponent as LogoutIcon } from "@icons/logout.svg";
import { ReactComponent as BurgerMenu } from "@icons/menu-burger.svg";

import { FlipButton } from "./FlipButton";
import { HighlightedLink } from "./HiglightedLink";
import { Refetch } from "./Modals";
import { PageLoader } from "./PageLoader";
import { useAuth } from "src/hooks";
import { removeAuthToken } from "src/utils/authToken";

export const Header = ({ showFlip }: { showFlip: boolean }) => {
  const [signingOut, toggleSignOut] = useState(false);
  const user = useAuth();
  const [showNavMenu, toggleNavMenu] = useState(false);

  const onSignOut = () => {
    toggleSignOut(true);
    removeAuthToken();
    location.assign("/login");
  }

  return (
    <div className={twMerge("w-full flex items-center justify-between bg-purple-900 py-5 px-6 text-4xl",
    "shadow-lg shadow-purple-700/75 sticky top-0 z-50",
    showNavMenu && "relative")}>
      <Refetch
        isRefetching={signingOut}
      />
      <PageLoader />
      {user && <>
      <div role="button" className="text-white lg:hidden cursor-pointer
        hover:text-yellow-400 active:text-yellow-500 active:scale-90"
        onClick={() => toggleNavMenu(true)}>
          <BurgerMenu className="min-[580px]:w-20 min-[580px]:h-20 h-14 w-14" />
      </div>
      <div className={twMerge("gap-10 items-center lg:flex hidden",
        showNavMenu && "absolute top-0 left-0 h-[100vh] w-[100vw] flex flex-col justify-center bg-purple-900 z-[100]")}
        onClick={() => toggleNavMenu(false)}>
          <HighlightedLink
            href="/home"
          >
            Home
          </HighlightedLink>
          <HighlightedLink
            href="/decks"
          >
            Decks
          </HighlightedLink>
          <HighlightedLink
            href="/pokemons"
          >
            Pókemons
          </HighlightedLink>
      </div>
      </>}
      {user && <div className="flex gap-4 items-center">
        {showFlip && <FlipButton/>}
        <span className="min-[580px]:text-6xl lg:text-4xl text-2xl">Hello, {user.name}!</span>
        <LogoutIcon
          role="button"
          onClick={onSignOut}
          className="lg:w-8 lg:h-8 min-[580px]:w-14 min-[580px]:h-14 w-10 h-10 stroke-white hover:stroke-yellow-400 active:stroke-yellow-500 cursor-pointer"
        />
      </div>}
      {!user && <HighlightedLink href="/login">Sign In</HighlightedLink>}
    </div>
  );
};
