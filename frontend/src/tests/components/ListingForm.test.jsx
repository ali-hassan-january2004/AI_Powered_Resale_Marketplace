import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ListingForm from "../../components/selling/ListingForm";

const categories = [
  { _id: "c1", name: "Women", slug: "women", children: [{ _id: "c4", name: "Dresses", slug: "women-dresses", parent: "c1" }] },
];

const photo = () => new File(["x"], "jacket.png", { type: "image/png" });

async function fillValidForm(user, container) {
  await user.upload(container.querySelector('input[type="file"]'), photo());
  await user.type(screen.getByLabelText("Title"), "Black leather jacket");
  await user.type(screen.getByLabelText("Description"), "Genuine leather, worn a few times, no flaws.");
  await user.selectOptions(screen.getByLabelText("Category"), "c4");
  await user.type(screen.getByLabelText("Brand"), "AllSaints");
  await user.selectOptions(screen.getByLabelText("Size"), "M");
  await user.selectOptions(screen.getByLabelText("Color"), "black");
  await user.click(screen.getByRole("radio", { name: /^good/i }));
  await user.type(screen.getByLabelText("Price"), "85");
}

describe("ListingForm", () => {
  it("shows validation errors and does not submit an empty form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ListingForm categories={categories} onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /publish listing/i }));

    expect(await screen.findByText("Title must be at least 5 characters")).toBeInTheDocument();
    expect(screen.getByText("Choose a category")).toBeInTheDocument();
    expect(screen.getByText("Select the condition")).toBeInTheDocument();
    expect(screen.getByText("Price must be greater than 0")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("requires at least one photo", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ListingForm categories={categories} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Title"), "Black leather jacket");
    await user.type(screen.getByLabelText("Description"), "Genuine leather, worn a few times, no flaws.");
    await user.selectOptions(screen.getByLabelText("Category"), "c4");
    await user.type(screen.getByLabelText("Brand"), "AllSaints");
    await user.selectOptions(screen.getByLabelText("Size"), "M");
    await user.selectOptions(screen.getByLabelText("Color"), "black");
    await user.click(screen.getByRole("radio", { name: /^good/i }));
    await user.type(screen.getByLabelText("Price"), "85");
    await user.click(screen.getByRole("button", { name: /publish listing/i }));

    expect(await screen.findByText("Add at least one photo.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid values with the photos", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { container } = render(<ListingForm categories={categories} onSubmit={onSubmit} />);

    await fillValidForm(user, container);
    await user.click(screen.getByRole("button", { name: /publish listing/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const [values, images, options] = onSubmit.mock.calls[0];
    expect(values).toMatchObject({
      title: "Black leather jacket",
      category: "c4",
      brand: "AllSaints",
      size: "M",
      color: "black",
      condition: "good",
      price: 85,
    });
    expect(images).toHaveLength(1);
    expect(images[0].isCover).toBe(true);
    expect(options).toEqual({ draft: false });
  });

  it("saves a draft with only a title", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ListingForm categories={categories} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Title"), "Half-finished listing");
    await user.click(screen.getByRole("button", { name: /save as draft/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][2]).toEqual({ draft: true });
  });

  it("asks for a title before saving a draft", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ListingForm categories={categories} onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /save as draft/i }));

    expect(await screen.findByText(/add a title so you can find this draft later/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});