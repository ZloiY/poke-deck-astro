import { useStore } from "effector-react";
import { useEffect, useState } from "react";
import { $authToken } from "src/utils/authToken";
import { z } from "zod";

const getAuthInfo = (token: string): { id: string; name: string } | null => {
  if (token.length > 0) {
    const jwtTokenBody = token.split(".")[1];
    const body = JSON.parse(decodeURIComponent(atob(jwtTokenBody)));
    const validatedBody = z
      .object({
        id: z.string(),
        name: z.string(),
        exp: z.number(),
      })
      .safeParse(body);
    if (validatedBody.success) {
      if (new Date() < new Date(validatedBody.data.exp)) {
        const { id, name } = validatedBody.data;
        return { id, name };
      }
    }
  }
  return null;
};

export const useAuth = () => {
  const authToken = useStore($authToken);
  const [user, setUser] = useState(() => getAuthInfo(authToken ?? ""));

  useEffect(() => {
    setUser(getAuthInfo(authToken ?? ""));
  }, [authToken]);

  return user;
};
