import type { APIRoute } from "astro";
import sha256 from "crypto-js/sha256";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import { z } from "zod";

import { prisma } from "../../server/db";

const passwordRegEx = /[\w(@|#|$|&)+]{6}/g;

export const post: APIRoute = async ({ request }) => {
  const creds = await request.json();
  const parsedCreds = z
    .object({
      username: z.string().min(3),
      password: z.string().regex(passwordRegEx),
    })
    .safeParse(creds);
  if (parsedCreds.success) {
    const { data } = parsedCreds;
    const user = await prisma.user.findUnique({
      where: { name: data.username },
      include: { decks: true },
    });
    const hash = sha256(`${data.password}${user?.salt}`).toString();
    if (user && hash == user.hash) {
      const refresh_token = jwt.sign({}, import.meta.env.AUTH_SECRET, {
        expiresIn: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });
      const session: Session = {
        id: user.id,
        name: user.name,
        refresh_token,
      };
      const access_token = jwt.sign(session, import.meta.env.AUTH_SECRET, {
        expiresIn: Date.now() + 2 * 60 * 60 * 1000,
      });
      const message = {
        id: v4(),
        state: "Success",
        message: "You've succcessfully logged in!",
        access_token,
      };
      return new Response(JSON.stringify(message), {
        status: 200,
      });
    }
  }
  const message = {
    id: v4(),
    state: "Failure",
    message: "You entered wrong credentials.",
  };
  return new Response(JSON.stringify(message), {
    status: 400,
  });
};
