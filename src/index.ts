import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

import octokit from "./gh";
import { fileStorage, uploadKeys } from "./storage";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["https://xell.barrenechea.cl"],
    allowMethods: ["GET", "POST"],
  })
);

app.post(
  "/generate",
  zValidator(
    "json",
    z.object({
      background_color: z.string().optional(),
      foreground_color: z.string().optional(),
      ascii_art: z.string().optional(),
    })
  ),
  async (c) => {
    const body = c.req.valid("json");
    const id = createId();
    const key = createId();

    try {
      await octokit.actions.createWorkflowDispatch({
        owner: "barrenechea",
        repo: "xell-reloaded",
        ref: "main",
        workflow_id: "custom-build.yml",
        inputs: {
          id,
          key,
          ...body,
        },
      });
    } catch (error: any) {
      if (error.status) {
        return c.json({ error: error.message }, error.status);
      }
      return c.json({ error: "Failed to dispatch workflow" }, 418);
    }

    uploadKeys.push({ id, key });
    return c.json({ id });
  }
);

app.post(
  "/upload",
  zValidator(
    "json",
    z.object({
      id: z.string(),
      key: z.string(),
      file: z.string(),
    })
  ),
  async (c) => {
    const { id, key, file } = c.req.valid("json");

    const uploadKey = uploadKeys.find((k) => k.id === id && k.key === key);
    if (!uploadKey) return c.json({ error: "Invalid id or key" }, 403);

    fileStorage.push({ id, file });
    return c.status(201);
  }
);

app.get(
  "/download/:id",
  zValidator(
    "param",
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const { id } = c.req.valid("param");

    const validId = uploadKeys.find((k) => k.id === id);
    if (!validId) return c.json({ error: "Invalid id" }, 404);

    const storedFile = fileStorage.find((f) => f.id === id);
    if (!storedFile) return c.json({ error: "File not processed yet" }, 404);

    const { file } = storedFile;
    fileStorage.splice(fileStorage.indexOf(storedFile), 1);
    uploadKeys.splice(uploadKeys.indexOf(validId), 1);

    return c.json({ file });
  }
);

export default app;
