import { twMerge } from "tailwind-merge";

export const HighlightedLink = ({
  href,
  children,
}: {
  href: string;
  children: string;
}) => {
  const isHighLighted = () => {
    const firstPart = location.pathname.split("/")[1];
    return `/${firstPart}` == href;
  };

  return (
    <a
      className={twMerge(
        "font-modak min-[580px]:text-8xl text-6xl lg:text-5xl hover:text-yellow-400",
        isHighLighted() && "text-yellow-500",
      )}
      href={href}
    >
      {children}
    </a>
  );
};
