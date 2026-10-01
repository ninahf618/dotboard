import { z } from "zod";

export const createItemSchema = z.object({
  title: z.string().min(1),
  note: z.string(),
  rating: z.number().int().min(1).max(5),
  status: z.enum(["open", "doing", "done"]),
  tags: z.array(z.string().min(1)).optional(),
});

export const updateItemSchema = createItemSchema.partial();

export const listItemsQuerySchema = z.object({
  tag: z.string().min(1).optional(),
  status: z.enum(["open", "doing", "done"]).optional(),
  sort: z.enum(["id", "rating"]).default("id"),
});

export type ListItemsQuery = z.infer<typeof listItemsQuerySchema>;
