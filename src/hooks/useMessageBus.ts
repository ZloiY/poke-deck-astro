import { useEffect, useMemo, useState } from "react";

import { EventBus } from "../services/EventBus";

const messageBus = new EventBus<Message>();

export const setNewMessages = messageBus.setNewValues;

export const pushMessage = messageBus.push;

export const useMessageBus = () => {
  const [messages, setNewMessages] = useState<Message[]>([]);

  useEffect(() => {
    const unSub = messageBus.subscribe(setNewMessages);
    return unSub;
  }, []);

  return useMemo(
    () => ({
      messages,
      pushMessage: messageBus.push,
      deleteMessage: messageBus.deleteById,
    }),
    [messages],
  );
};
