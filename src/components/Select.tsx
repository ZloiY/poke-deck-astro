import Downshift from "downshift";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { ReactComponent as Chevron } from "@icons/arrow-left.svg";

export const Select = <Item extends { id: string | number; name: string }>({
  className = "",
  items = [],
  placeholder = "",
  selectedItem = null,
  label = "Select value:",
  showItemName = (item: Item) => item.name,
  onSelect,
}: {
  className?: string;
  items?: Item[];
  selectedItem?: Item | null;
  placeholder?: string;
  label?: string;
  showItemName?: (item: Item) => ReactNode;
  onSelect: (item?: Item | null) => void;
}) => {
  return (
    <Downshift
      selectedItem={selectedItem}
      itemToString={(item) => item?.name || ""}
      onChange={(item) => onSelect(item)}
    >
      {({
        getRootProps,
        getLabelProps,
        getInputProps,
        getToggleButtonProps,
        getMenuProps,
        getItemProps,
        selectedItem,
        isOpen,
      }) => (
        <div>
          <div
            className={twMerge(
              "w-full flex flex-col gap-2 relative",
              className,
            )}
          >
            <label
              className="font-coiny text-xl text-white"
              {...getLabelProps()}
            >
              {label}
            </label>
            <div
              className={twMerge(
                "flex justify-between border-2 rounded-xl border-purple-900 hover:border-yellow-500 bg-purple-500",
                isOpen && "border-b-0 border-yellow-500 rounded-b-none",
              )}
              {...getRootProps({}, { suppressRefError: true })}
            >
              <input
                placeholder={placeholder}
                className="w-full placeholder-white p-3 bg-transparent outline-none"
                {...getInputProps()}
              />
              <button
                type="button"
                aria-label="toggle-menu"
                className="bg-transparent px-2"
                {...getToggleButtonProps()}
              >
                <div
                  className={twMerge(
                    "-rotate-90 transition-transform text-purple-900",
                    isOpen && "rotate-90",
                  )}
                >
                  <Chevron className="fill-purple-900 h-8 w-8" />
                </div>
              </button>
              <ul
                className={twMerge(
                  "absolute left-0 mt-10 w-full border-yellow-500 bg-purple-500 border-2 border-t-0 rounded-b-xl max-h-60",
                  "overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent",
                  "transition-all ease-in delay-75 duration-200",
                  !isOpen && "hidden h-0",
                )}
                {...getMenuProps()}
              >
                {isOpen
                  ? items
                      .filter((item) => item.id != selectedItem?.id)
                      .map((item, index) => (
                        <li
                          className={twMerge(
                            "border-t p-2 border-yellow-500 text-purple-900 transition-colors",
                            "bg-purple-500 hover:bg-purple-900 hover:text-yellow-500 hover:border-purple-900 font-coiny text-xl",
                          )}
                          {...getItemProps({
                            key: item.id,
                            index,
                            item,
                          })}
                        >
                          {showItemName(item)}
                        </li>
                      ))
                  : null}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Downshift>
  );
};
