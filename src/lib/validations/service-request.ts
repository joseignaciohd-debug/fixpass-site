import { z } from "zod";

export const serviceRequestSchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(1000),
  preferredWindow: z.string().min(3).max(120),
  area: z.string().min(2).max(80),
  notes: z.string().max(500).optional(),
});

export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
