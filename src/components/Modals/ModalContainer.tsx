import { createEvent, createStore } from "effector";
import type { ReactNode } from "react";
import ReactModal from "react-modal";
import { twMerge } from "tailwind-merge";

import { ReactComponent as Close } from "@icons/close.svg";
import { useStore } from "effector-react";

export const $isModalShown = createStore(false);
const toggleModal = createEvent<boolean>();
$isModalShown.on(toggleModal, (_, value) => value);

typeof window !== 'undefined' && ReactModal.setAppElement("body");

export const ModalContainer = ({
  title = "",
  children,
  onClose,
  anotherAtom,
}: {
  children: (onClose: () => void) => ReactNode;
  onClose?: () => void;
  title?: string;
  anotherAtom?: typeof $isModalShown,
}) => {
  const modalState = useStore(anotherAtom ?? $isModalShown);

 // const [style, api] = useSpring(
 //   () => ({
 //     from: { opacity: 0, scale: 0 },
 //     to: [{ opacity: 1, scale: 1 }],
 //     reset: true,
 //     config: config.stiff,
 //   }),
 //   [modalState],
 // );

  const onRequestClose = () => {
  //  api.start({
  //    from: { opacity: 1, scale: 1 },
  //    to: { opacity: 0, scale: 0 },
  //    config: config.stiff,
  //  });
    const timeoutId = setTimeout(() => {
      toggleModal(false);
      onClose?.();
      clearTimeout(timeoutId);
    }, 100);
  };

  return (
    <ReactModal
      isOpen={modalState}
      overlayClassName="fixed inset-0 bg-transparent backdrop-blur z-[100] flex justify-center items-center"
      className="static outline-none"
      onRequestClose={onRequestClose}
    >
      <div
        className={twMerge(title && "bg-purple-900 text-white rounded-xl flex flex-col relative opacity-0 shadow-[0_0_20px_5px] shadow-purple-500")}
      >
        {title && <div className="flex justify-between mb-2 p-3 border-b-2 border-yellow-500">
          <span className="text-2xl font-coiny">{title}</span>
          <Close
            role="button"
            className="cursor-pointer w-8 h-8 hover:text-yellow-400"
            onClick={onRequestClose}
          />
        </div>}
        {children(onRequestClose)}
      </div>
    </ReactModal>
  );
};
