import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { downloadParamsSchema, generateSchema, uploadSchema } from "../schemas";
import { downloadFile, generateBuild, uploadFile } from "../services/build.service";

const app = new Hono();

// Health check
app.get("/health", function healthCheck(c) {
  return c.json({ status: "ok" });
});

// Generate build
app.post("/generate", zValidator("json", generateSchema), async function handleGenerate(c) {
  try {
    const body = c.req.valid("json");
    const result = await generateBuild(body);
    return c.json(result);
  } catch (error: unknown) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Upload file
app.post("/upload", zValidator("json", uploadSchema), async function handleUpload(c) {
  try {
    const body = c.req.valid("json");
    const result = await uploadFile(body);
    return c.json(result);
  } catch (error: unknown) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Download file
app.get(
  "/download/:id",
  zValidator("param", downloadParamsSchema),
  async function handleDownload(c) {
    try {
      const { id } = c.req.valid("param");
      const result = await downloadFile(id);
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
