import superjson from "superjson";

import { QueryClient } from "@tanstack/react-query";
import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./server/api/root";
import { getAuthToken } from "./utils/authToken";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (import.meta.env.VERCEL_URL)
    return `https://${import.meta.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${import.meta.env.PORT ?? 3000}`; // dev SSR should use localhost
};

const trpcReact = createTRPCReact<AppRouter>();

/**
 * A set of typesafe react-query hooks for your tRPC API
 */
const trpcAstro = createTRPCProxyClient<AppRouter>({
  /**
   * Transformer used for data de-serialization from the server
   * @see https://trpc.io/docs/data-transformers
   **/
  transformer: superjson,

  /**
   * Links used to determine request flow from client to server
   * @see https://trpc.io/docs/links
   * */
  links: [
    // loggerLink({
    //   enabled: (opts) =>
    //     import.meta.env.NODE_ENV === "development" ||
    //     (opts.direction === "down" && opts.result instanceof Error),
    // }),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers() {
        return { Authorization: getAuthToken() };
      },
    }),
  ],
});

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export { trpcAstro, trpcReact };
