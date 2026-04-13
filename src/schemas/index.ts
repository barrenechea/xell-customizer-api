import { z } from "zod";

// Generate build schemas
export const generateSchema = z.object({
  background_color: z.string().optional(),
  foreground_color: z.string().optional(),
  ascii_art: z.string().optional(),
});

export type GenerateInput = z.infer<typeof generateSchema>;
