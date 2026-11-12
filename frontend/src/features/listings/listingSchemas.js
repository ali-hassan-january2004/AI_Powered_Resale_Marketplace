import { z } from "zod";
import { CONDITIONS } from "../../utils/constants";

export const LISTING_STATUSES = ["draft", "active", "reserved", "sold", "flagged", "removed"];
const conditionValues = CONDITIONS.map((c) => c.value);

// Same rules as the backend (SRS LST-01, LST-08)
export const listingSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  description: z.string().trim().min(20, "Describe the item in at least 20 characters").max(2000),
  category: z.string().min(1, "Choose a category"),
  brand: z.string().trim().min(1, "Enter a brand (or 'Unbranded')").max(50),
  size: z.string().min(1, "Choose a size"),
  color: z.string().min(1, "Choose a color"),
  condition: z.enum(conditionValues, { errorMap: () => ({ message: "Select the condition" }) }),
  price: z.coerce.number().positive("Price must be greater than 0").max(10000000),
});

// Drafts only need a title (SRS LST-05)
export const listingDraftSchema = listingSchema
  .partial()
  .extend({ title: z.string().trim().min(1, "Add a title so you can find this draft later") });

export const reportSchema = z.object({
  targetType: z.enum(["listing", "user", "review"]),
  targetId: z.string().min(1),
  reason: z.string().trim().min(5, "Please give a reason").max(300),
});

// For validating URL query params on browse pages
export const listingFiltersSchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  size: z.string().optional(),
  condition: z.enum(conditionValues).optional(),
  brand: z.string().optional(),
  color: z.string().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "popular"]).optional(),
  page: z.coerce.number().int().positive().optional(),
});