import { describe, expect, it } from "vitest";
import { formatPrice } from "../../utils/formatPrice";

// Compare digits only so the tests pass in any locale
const digits = (s) => s.replace(/\D/g, "");

describe("formatPrice", () => {
  it("formats whole amounts", () => {
    expect(digits(formatPrice(1500))).toBe("1500");
  });

  it("shows no decimals and rounds", () => {
    expect(digits(formatPrice(1234.56))).toBe("1235");
  });

  it("treats a missing value as zero", () => {
    expect(digits(formatPrice())).toBe("0");
    expect(digits(formatPrice(0))).toBe("0");
  });

  it("includes a currency marker", () => {
    expect(formatPrice(10)).toMatch(/[^\d\s.,]/);
  });
});