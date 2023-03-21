import type { APIRoute } from "astro"


export const get: APIRoute = async ({ params, redirect }) => {
  return redirect('home', 307)
};

export const all: APIRoute = async () => {
  const headers = new Headers({
      Allow: 'OPTIONS, GET, POST',
  })
  return new Response(null, {
      status: 200,
      headers,
  })
}
