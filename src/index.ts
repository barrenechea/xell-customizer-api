import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { generateSchema } from "./schemas";
import { generateBuild } from "./services/build.service";
import { HTTPException } from "hono/http-exception";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(
  "*",
  cors({
    origin: ["https://xell.barrenechea.cl"],
    allowMethods: ["GET", "POST"],
  }),
);

app.post(
  "/generate",
  zValidator("json", generateSchema),
  async function handleGenerate(c) {
    try {
      const body = c.req.valid("json");
      const result = await generateBuild(body, c.env.GITHUB_TOKEN);
      return c.json(result);
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        return c.json({ error: error.message }, error.status);
      }
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

export default app;
