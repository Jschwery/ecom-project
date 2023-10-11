import React, { ReactNode, createContext, useContext } from "react";

const EnvironmentContext = createContext<boolean | undefined>(undefined);

export const EnvironmentProvider = ({ children }: { children: ReactNode }) => {
  const isDevelopment = process.env.REACT_APP_ENV_TYPE === "development";

  return (
    <EnvironmentContext.Provider value={isDevelopment}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  console.log("the context: " + context);
  return context;
};
