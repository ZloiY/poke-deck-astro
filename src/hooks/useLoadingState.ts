import { useEffect, useState } from "react";

type LoadingState = "Started" | "Finished" | "Hold";

export const useLoadingState = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>("Hold");

  useEffect(() => {
    document.onreadystatechange = () => {
      switch (document.readyState) {
        case "loading": {
          setLoadingState("Started");
          break;
        }
        case "complete": {
          setLoadingState("Finished");
          break;
        }
      }
    };
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (loadingState == "Finished") {
      timeoutId = setTimeout(() => {
        setLoadingState("Hold");
      }, 500);
    }
    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [loadingState]);

  return loadingState;
};
