/// <reference types="vite-plugin-svgr/client" />
type JWTToken = string;
type CreateDeckParams = {
  name: string;
  private: boolean;
};

type Session = {
  id: string;
  name: string;
  numberOfDecks: number;
  refresh_token: string;
};

type Message = {
  id: string;
  state: "Success" | "Failure";
  message: string;
};

type FlipState = "Preview" | "Details";

type PaginationState = "Initial" | "Next" | "Prev";
