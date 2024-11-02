import { skillService } from "~~/server/services/database/SkillService";

export default defineEventHandler(async () => {
  return await skillService.getAll();
});
