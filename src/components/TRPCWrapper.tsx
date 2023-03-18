import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { FC, useState } from "react";
import superjson from "superjson";

import { getAuthToken } from "src/utils/authToken";
import { trpcReact } from "../api";

export const TRPCWrapper = <Props extends {}>(Component: FC<Props>) => (props: Props) => {
  const [trpcReactClient] = useState(() => trpcReact.createClient({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: "/api/trpc",
        headers() {
          return {
            Authorization: getAuthToken(),
          };
        },
      }),
    ],
  }));

  const [reactQueryClient] = useState(() => new QueryClient());

  return (
    <trpcReact.Provider client={trpcReactClient} queryClient={reactQueryClient}>
      <QueryClientProvider client={reactQueryClient}>
        <Component {...props}/>
      </QueryClientProvider>
    </trpcReact.Provider>
  );
};
