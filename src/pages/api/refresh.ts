import type { APIRoute } from "astro";
import jwt from "jsonwebtoken";
import { validateToken } from "src/utils/tokenValidator";

export const post: APIRoute = ({ request }) => {
  const authorizationToken = request.headers.get("Authorization");
  const access_token = authorizationToken?.split(" ")[1];
  console.log('refresh access', access_token);
  if (access_token) {
    const decodedToken = jwt.verify(access_token, import.meta.env.AUTH_SECRET);
    console.log("decodedToken", decodedToken);
    const validatedToken = validateToken(decodedToken);
    if (validatedToken.success) {
      const refreshToken = jwt.verify(
        validatedToken.data.refresh_token,
        import.meta.env.AUTH_SECRET,
      );

      if (
        typeof refreshToken != "string" &&
        new Date(refreshToken.exp ?? "") > new Date()
      ) {
        const newRefreshToken = jwt.sign({}, import.meta.env.AUTH_SECRET, {
          expiresIn: "7d",
        });
        const newToken = jwt.sign(
          { ...validatedToken, refresh_token: newRefreshToken },
          import.meta.env.AUTH_SECRET,
          { expiresIn: "2h" },
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
