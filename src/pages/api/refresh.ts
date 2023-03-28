import type { APIRoute } from "astro";
import jwt from "jsonwebtoken";
import { validateToken } from "src/utils/tokenValidator";

export const post: APIRoute = ({ request }) => {
  const authorizationToken = request.headers.get("Authorization");
  const access_token = authorizationToken?.split(" ")[1];
  if (access_token) {
    const decodedToken = jwt.verify(access_token, import.meta.env.AUTH_SECRET, {
      ignoreExpiration: true,
    });
    const validatedToken = validateToken(decodedToken);
    if (validatedToken.success) {
      const refreshToken = jwt.verify(
        validatedToken.data.refresh_token,
        import.meta.env.AUTH_SECRET,
      );
      if (
        typeof refreshToken != "string" &&
        (refreshToken.exp ?? 0) > Date.now()
      ) {
        const newRefreshToken = jwt.sign({}, import.meta.env.AUTH_SECRET, {
          expiresIn: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });
        const newToken = jwt.sign(
          { ...validatedToken, refresh_token: newRefreshToken },
          import.meta.env.AUTH_SECRET,
          { expiresIn: Date.now() + 2 * 60 * 60 * 1000 },
        );
        return new Response(JSON.stringify(newToken), {
          status: 200,
        });
      }
    }
  }

  return new Response(undefined, {
    status: 401,
  });
};
