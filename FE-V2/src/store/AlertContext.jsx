/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import { AlertMessage } from "../shared/AlertMessage";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
  }, []);

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
        />
      )}
    </AlertContext.Provider>
  );
}

// Hook untuk memudahkan pemanggilan alert
export const useAlert = () => useContext(AlertContext);
