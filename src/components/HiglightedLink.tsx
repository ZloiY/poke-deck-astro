import { twMerge } from "tailwind-merge";

export const HighlightedLink = ({ href, children }: { href: string,  children: string }) => {
  return <a
  className={twMerge("font-modak min-[580px]:text-8xl text-6xl lg:text-5xl hover:text-yellow-400",
    location.pathname == href && "text-yellow-500")}
  href={href}>
    {children}
  </a>
}
