import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { itemsRoute } from "./routes/items.js";
import {
  NotFoundError,
  TransitionError,
  notFoundError,
  badRequestError,
} from "./errors.js";

const app = new Hono();

app.use("*", cors());
app.use("*", logger());

app.get("/health", (c) => c.json({ status: "ok" }));
app.route("/items", itemsRoute);

app.onError((err, c) => {
  if (err instanceof NotFoundError) {
    return notFoundError(c);
  }
  if (err instanceof TransitionError) {
    return badRequestError(c, err.issues);
  }
  console.error(err);
  return c.json({ error: "Internal Server Error" }, 500);
});
export default app;
