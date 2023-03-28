import jwt from "jsonwebtoken";

import { validateToken } from "./tokenValidator";

export const checkToken = (access_token?: string) => {
  if (!!access_token) {
    const decodedToken = jwt.verify(access_token, import.meta.env.AUTH_SECRET);
    const validatedToken = validateToken(decodedToken);
    if (
      validatedToken.success &&
      validatedToken.data.exp > Date.now()
    ) {
      return {
        id: validatedToken.data.id,
        name: validatedToken.data.name,
        numberOfDecks: validatedToken.data.numberOfDecks,
        refresh_token: validatedToken.data.refresh_token,
      };
    }
  }
  return null;
};

export const checkHeader = (
  authorizationHeader: string | null,
): Session | null => {
  const access_token = authorizationHeader?.split(" ")[1];
  return checkToken(access_token);
};
