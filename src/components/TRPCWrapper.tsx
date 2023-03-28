import { FC, useEffect, useRef, useState } from "react";
import { useStore } from "effector-react";
import { $authTokenHeader, getAuthToken } from "src/utils/authToken";
import superjson from "superjson";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";

import { trpcReact } from "../api";

export const TRPCWrapper =
  <Props extends {}>(Component: FC<Props>) =>
  (props: Props) => {
    const authHeader = useStore($authTokenHeader);
    const trpcReactClientRef = useRef(
      trpcReact.createClient({
        transformer: superjson,
        links: [
          httpBatchLink({
            url: "/api/trpc",
            headers() {
              return {
                Authorization: authHeader,
              };
            },
          }),
        ],
      }),
    );

    useEffect(() => {
      trpcReactClientRef.current = 
        trpcReact.createClient({
          transformer: superjson,
          links: [
            httpBatchLink({
              url: "/api/trpc",
              headers() {
                return {
                  Authorization: authHeader,
                };
              },
            }),
          ],
        });
    }, [authHeader])


    const [reactQueryClient] = useState(() => new QueryClient());

    return (
      <trpcReact.Provider
        client={trpcReactClientRef.current}
        queryClient={reactQueryClient}
      >
        <QueryClientProvider client={reactQueryClient}>
          <Component {...props} />
        </QueryClientProvider>
      </trpcReact.Provider>
    );
  };
