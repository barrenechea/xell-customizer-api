import { z } from "zod";

// Generate build schemas
export const generateSchema = z.object({
  background_color: z.string().optional(),
  foreground_color: z.string().optional(),
  ascii_art: z.string().optional(),
});

// Upload schemas
export const uploadSchema = z.object({
  id: z.string(),
  key: z.string(),
  file: z.string(),
  filename: z.string(),
  error: z.string().optional(),
});

// Download schemas
export const downloadParamsSchema = z.object({
  id: z.string(),
});

export type GenerateInput = z.infer<typeof generateSchema>;
export type UploadInput = z.infer<typeof uploadSchema>;
export type DownloadParams = z.infer<typeof downloadParamsSchema>;
