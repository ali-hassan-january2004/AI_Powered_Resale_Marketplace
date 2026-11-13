import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./styles/globals.css";

async function enableMocks() {
  if (import.meta.env.VITE_USE_MOCKS !== "true") return;
  const { startMocks } = await import("./mocks/browser");
  await startMocks();
}

enableMocks().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
});