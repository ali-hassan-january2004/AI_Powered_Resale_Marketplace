import { z } from "zod";

const phone = z.string().trim().min(7, "Enter a contact phone number").max(20);
const shopName = z.string().trim().min(3, "Shop name must be at least 3 characters").max(40);

// AUTH-07
export const becomeSellerSchema = z.object({
  shopName,
  phone,
  bio: z.string().trim().max(300).optional(),
});

// SLR-06
export const shopSettingsSchema = becomeSellerSchema.extend({
  returnPolicy: z.string().trim().max(500).optional(),
});

// SLR-03
export const orderStatusSchema = z.object({
  status: z.enum(["confirmed", "shipped", "delivered"]),
  note: z.string().trim().max(200).optional(),
});