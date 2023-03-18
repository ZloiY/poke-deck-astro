import { useCallback, useMemo, useState } from "react";
import { getAuthToken } from "src/utils/authToken";
import { z } from "zod";

const getAuthInfo = (): { id: string, name: string } | null => {
  const token = getAuthToken();
  if (token.length > 0) {
    const jwtTokenBody = token.split(' ')[1].split('.')[1];
    const body = JSON.parse(decodeURIComponent(atob(jwtTokenBody)));
    const validatedBody = z.object({
      id: z.string(),
      name: z.string(),
    }).safeParse(body);
    if (validatedBody.success) {
      return validatedBody.data;
    }
  }
  return null;
}

export const useAuth = () => {
  const [user, setUser] = useState(() => getAuthInfo());

  const refreshUser = useCallback(() => {
    setUser(getAuthInfo());  
  },[])

  return useMemo(() => ({ user, refreshUser }), [user]);
}
