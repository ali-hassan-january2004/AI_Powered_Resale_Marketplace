import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import ListingCard from "../../components/listings/ListingCard";
import { renderWithProviders } from "../renderWithProviders";

const listing = {
  _id: "l1",
  title: "Black leather jacket",
  brand: "AllSaints",
  size: "M",
  price: 85,
  status: "active",
  images: [{ url: "https://example.com/jacket.jpg", isCover: true }],
};

describe("ListingCard", () => {
  it("shows the title, brand, size and price", () => {
    renderWithProviders(<ListingCard listing={listing} />);
    expect(screen.getByText("Black leather jacket")).toBeInTheDocument();
    expect(screen.getByText("AllSaints · Size M")).toBeInTheDocument();
    expect(screen.getByText((content) => content.replace(/\D/g, "") === "85")).toBeInTheDocument();
  });

  it("links to the listing detail page", () => {
    renderWithProviders(<ListingCard listing={listing} />);
    expect(screen.getByText("Black leather jacket").closest("a")).toHaveAttribute("href", "/listing/l1");
  });

  it("uses the cover image with the title as alt text", () => {
    renderWithProviders(<ListingCard listing={listing} />);
    expect(screen.getByAltText("Black leather jacket")).toHaveAttribute("src", "https://example.com/jacket.jpg");
  });

  it("marks sold items", () => {
    renderWithProviders(<ListingCard listing={{ ...listing, status: "sold" }} />);
    expect(screen.getByText("sold")).toBeInTheDocument();
  });

  it("does not show a badge for active items", () => {
    renderWithProviders(<ListingCard listing={listing} />);
    expect(screen.queryByText("sold")).not.toBeInTheDocument();
    expect(screen.queryByText("reserved")).not.toBeInTheDocument();
  });

  it("shows the wishlist heart in the right state", () => {
    const { unmount } = renderWithProviders(<ListingCard listing={listing} />);
    expect(screen.getByRole("button", { name: /add to wishlist/i })).toHaveAttribute("aria-pressed", "false");
    unmount();

    renderWithProviders(<ListingCard listing={{ ...listing, isFavorite: true }} />);
    expect(screen.getByRole("button", { name: /remove from wishlist/i })).toHaveAttribute("aria-pressed", "true");
  });
});