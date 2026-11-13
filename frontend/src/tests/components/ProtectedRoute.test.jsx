import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../../components/layout/ProtectedRoute";
import { authState, buyer, renderWithProviders } from "../renderWithProviders";

const tree = (
  <Routes>
    <Route element={<ProtectedRoute />}>
      <Route path="/cart" element={<div>Cart page</div>} />
    </Route>
    <Route path="/login" element={<div>Login page</div>} />
  </Routes>
);

describe("ProtectedRoute", () => {
  it("redirects guests to the login page", () => {
    renderWithProviders(tree, { route: "/cart", preloadedState: { auth: authState(null) } });
    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Cart page")).not.toBeInTheDocument();
  });

  it("shows the page to logged-in users", () => {
    renderWithProviders(tree, { route: "/cart", preloadedState: { auth: authState(buyer) } });
    expect(screen.getByText("Cart page")).toBeInTheDocument();
  });

  it("waits for the session check before deciding", () => {
    renderWithProviders(tree, {
      route: "/cart",
      preloadedState: { auth: { ...authState(null), initialized: false } },
    });
    expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
    expect(screen.queryByText("Cart page")).not.toBeInTheDocument();
  });
});