import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { rootReducer } from "../app/store";

export const buyer = {
  _id: "buyer-1",
  name: "Test Buyer",
  email: "buyer@example.test",
  role: "buyer",
};

export const authState = (user) => ({
  user,
  status: "idle",
  initialized: true,
  error: null,
});

export function renderWithProviders(
  ui,
  { route = "/", preloadedState = {} } = {},
) {
  const store = configureStore({ reducer: rootReducer, preloadedState });
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>,
    ),
  };
}
