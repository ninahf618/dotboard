import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";
import {
  commentParamSchema,
  createCommentSchema,
  createItemSchema,
  listItemsQuerySchema,
  updateItemSchema,
} from "../schema.js";
import { commentService } from "../services/commentService.js";
import { itemService } from "../services/itemService.js";
import { badRequestError } from "../errors.js";
import { streamSSE } from "hono/streaming";
import { itemEvents } from "../events.js";

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

itemsRoute.get("/stream", async (c) => {
  return streamSSE(c, async (stream) => {
    let changed = true; // 接続直後に一度だけ最新状態を伝える
    const onChanged = () => {
      changed = true;
    };
    itemEvents.on("changed", onChanged);
    while (!stream.aborted) {
      if (changed) {
        changed = false;
        await stream.writeSSE({
          event: "changed",
          data: new Date().toISOString(),
        });
      }
      await stream.sleep(500);
    }
    itemEvents.off("changed", onChanged);
  });
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

itemsRoute.get(
  "/:itemId/comments",
  validate("param", commentParamSchema),
  async (c) => {
    const { itemId } = c.req.valid("param");
    const comments = await commentService.list(itemId);
    return c.json(comments);
  },
);

itemsRoute.post(
  "/:itemId/comments",
  validate("param", commentParamSchema),
  validate("json", createCommentSchema),
  async (c) => {
    const { itemId } = c.req.valid("param");
    const comment = await commentService.create(itemId, c.req.valid("json"));
    return c.json(comment, 201);
  },
);
