import type { APIRoute } from "astro";

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "../../../server/api/root";
import { createTRPCContext } from "../../../server/trpc";

export const all: APIRoute = ({ request }) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      import.meta.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : ({ error }) => console.log('Something wrong'),
  });
};
