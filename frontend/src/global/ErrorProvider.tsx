import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

type ErrorContextType = {
  errorQueue: any[];
  addErrorToQueue: (error: Error) => void;
};

const defaultContextValue: ErrorContextType = {
  errorQueue: [],
  addErrorToQueue: () => {},
};

const ErrorContext = createContext<ErrorContextType>(defaultContextValue);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const isDevelopment = process.env.REACT_APP_ENV_TYPE === "development";
  const [errorQueue, setErrorQueue] = useState<Error[]>([]);

  const addErrorToQueue = (error: Error) => {
    setErrorQueue((prev) => [...prev, error]);
  };

  useEffect(() => {
    const sendErrors = async () => {
      if (!isDevelopment) {
        console.log("Sending errors:", errorQueue);
        setErrorQueue([]);
      }
    };

    if (errorQueue.length >= 10) {
      sendErrors();
    }

    const timer = setTimeout(() => {
      if (errorQueue.length > 0) {
        sendErrors();
      }
    }, 20000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorQueue, isDevelopment]);

  return (
    <ErrorContext.Provider value={{ errorQueue, addErrorToQueue }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
