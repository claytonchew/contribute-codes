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
  title: z.string().min(1).max(255),
  content: z.string().min(1).max(10000),
  repositoryUrl: z.string().optional().nullable(),
  projectUrl: z.string().optional().nullable(),
  skills: z.array(z.string()).optional(),
});
