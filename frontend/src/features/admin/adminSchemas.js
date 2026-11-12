import { z } from "zod";

// ADM-05: a reason is required and the seller sees it
export const removeListingSchema = z.object({
  reason: z.string().trim().min(5, "Please give a reason (at least 5 characters)").max(300),
});

// ADM-06
export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(40),
  parent: z.string().optional(),
  icon: z.string().trim().max(30).optional(),
  isActive: z.boolean(),
});

// ADM-07
export const reportResolveSchema = z.object({
  status: z.enum(["dismissed", "actioned"]),
});

export const blockUserSchema = z.object({ blocked: z.boolean() });