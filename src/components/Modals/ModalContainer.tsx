import type { Store } from "effector";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import type { ReactNode } from "react";
import ReactModal from "react-modal";
import { useModalState } from "src/hooks";
import { twMerge } from "tailwind-merge";

import { ReactComponent as Close } from "@icons/close.svg";

typeof window !== "undefined" && ReactModal.setAppElement("main");

export const ModalContainer = ({
  title = "",
  children,
  onClose,
  anotherState,
}: {
  children: (onClose: () => void) => ReactNode;
  onClose?: () => void;
  title?: string;
  anotherState?: Store<boolean>;
}) => {
  const [modalState, { openModal, closeModal }] = useModalState(anotherState);

  const onRequestClose = () => {
    const timeoutId = setTimeout(() => {
      closeModal();
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
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.15, type: "spring", stiffness: 100 }}
          className={twMerge(
            title &&
              "bg-purple-900 text-white rounded-xl flex flex-col relative shadow-[0_0_20px_5px] shadow-purple-500",
          )}
        >
          {title && (
            <div className="flex justify-between mb-2 p-3 border-b-2 border-yellow-500">
              <span className="text-2xl font-coiny">{title}</span>
              <Close
                role="button"
                className="cursor-pointer w-8 h-8 hover:text-yellow-400"
                onClick={onRequestClose}
              />
            </div>
          )}
          {children(onRequestClose)}
        </motion.div>
      </AnimatePresence>
    </ReactModal>
  );
};
