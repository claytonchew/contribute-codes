import type { SeedStep } from "~~/database/seed/module/Seed";
import { tables } from "~~/server/utils/database";
import skillsData from "~~/database/seed/data/skills.json";

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
