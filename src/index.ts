import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

import octokit from "./utils/gh";
import { fileStorage, uploadKeys } from "./utils/storage";

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
        ref: "master",
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

    uploadKeys.save({ id, key });
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
      filename: z.string(),
    })
  ),
  async (c) => {
    const { id, key, file, filename } = c.req.valid("json");

    const uploadKey = await uploadKeys.find(id);
    if (!uploadKey || uploadKey.key !== key)
      return c.json({ error: "Invalid id or key" }, 403);

    await fileStorage.save({ id, file, filename });
    return c.json({ message: "File uploaded" });
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

    const uploadKey = await uploadKeys.find(id);
    if (!uploadKey) return c.json({ error: "Invalid id" }, 404);

    const storedFile = await fileStorage.find(id);
    if (!storedFile) return c.json({ error: "File not processed yet" }, 404);

    await uploadKeys.delete(id);
    await fileStorage.delete(id);

    return c.json({ file: storedFile.file, filename: storedFile.filename });
  }
);

export default app;
