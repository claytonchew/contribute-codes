import type { SeedStep } from "~~/server/database/seed/module/Seed";
import { tables } from "~~/server/utils/db";
import skillsData from "~~/server/database/seed/data/skills.json";

export default {
  seed: async (tx) => {
    await tx
      .insert(tables.skill.skill)
      .values([...skillsData])
      .onConflictDoNothing()
      .run();
  },
  continueOnError: false,
} as SeedStep;
