import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

import { ReactComponent as Close } from "@icons/close.svg";

import { useMessageBus } from "../hooks";

const Notification = ({ message }: { message: Message }) => {
  const { deleteMessage } = useMessageBus();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      deleteMessage(message);
    }, 6000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message.id]);

  return (
    <div
      className={twMerge(
        "w-80 rounded-3xl text-white p-4 z-[110] backdrop-blur-md",
        message.state == "Success"
          ? "bg-lime-400/70 shadow-[0px_0px_15px_4px] shadow-lime-500"
          : "bg-red-600/70 shadow-[0px_0px_15px_4px] shadow-red-700",
      )}
    >
      <div className="flex justify-between items-center w-full">
        <span className="text-2xl font-coiny">{message.state}!</span>
        <Close
          className="w-8 h-8 cursor-pointer active:scale-90"
          onClick={() => deleteMessage(message)}
        />
      </div>
      <p className="mt-5 text-center text-xl">{message.message}</p>
    </div>
  );
};

export const NotificationsPopups = () => {
  const { messages } = useMessageBus();
  return (
    <LazyMotion features={domAnimation}>
      <div className="absolute top-5 right-8 flex flex-col gap-5 z-[110]">
        <AnimatePresence>
          {messages.map((message) => (
            <m.div
              key={message.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <Notification message={message} />
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
};
