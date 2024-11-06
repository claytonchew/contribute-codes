import { z } from "zod";

export const projectGetAllOptionsSchema = z
  .object({
    pageOptions: z
      .object({
        page: z.number().optional(),
        perPage: z.number().optional(),
      })
      .optional(),
    sort: z.enum(["newest", "oldest"]).optional(),
    filters: z
      .object({
        skill: z.string().optional(),
        ownerId: z.string().optional(),
      })
      .optional(),
  })
  .optional();

export const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Required")
    .max(255, "Cannot be more than 255 characters"),
  content: z
    .string()
    .min(1, "Required")
    .max(10000, "Cannot be more than 10000 characters"),
  repositoryUrl: z.string().url().optional().nullable(),
  projectUrl: z.string().url().optional().nullable(),
  skills: z.array(z.string()),
});
