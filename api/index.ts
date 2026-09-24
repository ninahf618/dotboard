import { Hono } from "hono";
import { handle } from "hono/vercel";
import app from "../src/app.js";

export const config = { runtime: "nodejs" };

const vercelApp = new Hono().route("/api", app);

export const GET = handle(vercelApp);
export const POST = handle(vercelApp);
export const PUT = handle(vercelApp);
export const PATCH = handle(vercelApp);
export const DELETE = handle(vercelApp);
export const OPTIONS = handle(vercelApp);
