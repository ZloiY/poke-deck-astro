import type { APIRoute } from "astro"

export const options: APIRoute = () => {
 const headers = new Headers({
   Allow: 'OPTIONS, GET, POST',
 })
 return new Response(null, {
     status: 200,
     headers,
 })
}
