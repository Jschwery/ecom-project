import { useState } from "react";

export enum AlertType {
  WARN = "WARN",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export const useAlert = (): [
  AlertType | null,
  (alertType: AlertType) => void
] => {
  const [currentAlert, setCurrentAlert] = useState<AlertType | null>(null);

  const displayAlert = (alertType: AlertType) => {
    setCurrentAlert(alertType);
    setTimeout(() => {
      setCurrentAlert(null);
    }, 5500);
  };

  return [currentAlert, displayAlert];
};
