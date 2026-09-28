import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";
import {
  createItemSchema,
  listItemsQuerySchema,
  updateItemSchema,
} from "../schema.js";
import { itemService } from "../services/itemService.js";
import { badRequestError } from "../errors.js";

// 失敗時のレスポンスを { error, issues } の形にそろえるため、hookで badRequestError を返す
const validate = <T extends keyof ValidationTargets, S extends ZodType>(
  target: T,
  schema: S,
) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return badRequestError(c, result.error.issues);
    }
  });

export const itemsRoute = new Hono();

itemsRoute.get("/", validate("query", listItemsQuerySchema), async (c) => {
  const items = await itemService.list(c.req.valid("query"));
  return c.json(items);
});

itemsRoute.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const item = await itemService.get(id);
  return c.json(item);
});

itemsRoute.post("/", validate("json", createItemSchema), async (c) => {
  const item = await itemService.create(c.req.valid("json"));
  return c.json(item, 201);
});

itemsRoute.patch("/:id", validate("json", updateItemSchema), async (c) => {
  const id = Number(c.req.param("id"));
  const item = await itemService.update(id, c.req.valid("json"));
  return c.json(item);
});

itemsRoute.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await itemService.remove(id);
  return c.body(null, 204);
});
