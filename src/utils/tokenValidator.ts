import { z } from "zod";

export const validateToken = (decodedToken: unknown) =>
  z
    .object({
      id: z.string(),
      name: z.string(),
      numberOfDecks: z.number(),
      exp: z.number(),
      refresh_token: z.string(),
    })
    .safeParse(decodedToken);
