import type { Context } from "hono";

export const notFoundError = (c: Context) =>
  c.json({ error: "Not Found" }, 404);

export const badRequestError = (c: Context, issues: unknown) =>
  c.json({ error: "Bad Request", issues }, 400);

export class NotFoundError extends Error {}

export class TransitionError extends Error {
  issues: { path: string[]; message: string }[];

  constructor(issues: { path: string[]; message: string }[]) {
    super("invalid transition");
    this.issues = issues;
  }
}
