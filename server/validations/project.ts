import { z } from "zod";

export const projectSchema = {
  create: z.object({
    title: z.string().min(1).max(255),
    content: z.string().min(1).max(10000),
    snippet: z.never(), // snippet is generated from content
    ownerId: z.never(), // owner is set from the session
    createdAt: z.never(), // createdAt is set by the database
    updatedAt: z.never(), // updatedAt is set by the database
    id: z.never(), // id is set by the database
    repositoryUrl: z.string().optional().nullable(),
    projectUrl: z.string().optional().nullable(),
    skills: z.array(z.string()).optional(),
  }),

  update: z.object({
    title: z.string().min(1).max(255),
    content: z.string().min(1).max(10000),
    snippet: z.never(), // snippet is generated from content
    ownerId: z.never(), // original owner cannot be changed
    createdAt: z.never(), // createdAt is set by the database
    updatedAt: z.never(), // updatedAt is set by the database
    id: z.never(), // id is passed as a URL parameter
    repositoryUrl: z.string().optional().nullable(),
    projectUrl: z.string().optional().nullable(),
  }),

  updateSkills: z.object({
    skills: z.array(z.string()),
  }),

  updateContributors: z.object({
    contributorIds: z.array(z.string()),
  }),
};
