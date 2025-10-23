import { RouterProvider } from "@tanstack/react-router";
import { AlertProvider } from "./store/AlertContext";
import { router } from "./routes/Routes";

function App() {
  return (
    <>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </>
  );
}

export default App;
