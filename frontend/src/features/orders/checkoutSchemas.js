import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().trim().max(30).optional(),
  line1: z.string().trim().min(5, "Enter your street address").max(120),
  city: z.string().trim().min(2, "Enter your city").max(60),
  region: z.string().trim().min(2, "Enter your state / province").max(60),
  postalCode: z.string().trim().min(3, "Enter a postal code").max(12),
  country: z.string().trim().min(2, "Enter your country").max(60),
  isDefault: z.boolean().optional(),
});

export const paymentMethodSchema = z.enum(["cod", "test_card"]);

// Body of POST /orders
export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  paymentMethod: paymentMethodSchema,
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Choose a star rating").max(5),
  comment: z.string().trim().max(500, "Keep it under 500 characters").optional(),
});