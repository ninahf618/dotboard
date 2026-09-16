import { Hono } from "hono";
import { createItemSchema, updateItemSchema } from "../schema.js";
import { itemService } from "../services/itemService.js";
import { badRequestError } from "../errors.js";

export const itemsRoute = new Hono();

itemsRoute.get("/", async (c) => {
  const tag = c.req.query("tag");
  const items = await itemService.list(tag);
  return c.json(items);
});

itemsRoute.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const item = await itemService.get(id);
  return c.json(item);
});

itemsRoute.post("/", async (c) => {
  const body = await c.req.json();
  const result = createItemSchema.safeParse(body);

  if (!result.success) {
    return badRequestError(c, result.error.issues);
  }

  const item = await itemService.create(result.data);
  return c.json(item, 201);
});

itemsRoute.patch("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  const result = updateItemSchema.safeParse(body);

  if (!result.success) {
    return badRequestError(c, result.error.issues);
  }

  const item = await itemService.update(id, result.data);
  return c.json(item);
});

itemsRoute.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await itemService.remove(id);
  return c.body(null, 204);
});
