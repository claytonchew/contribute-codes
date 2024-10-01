import { skillService } from "~~/server/services/db/SkillService";

export default defineEventHandler(async () => {
  return createResponse.success(await skillService.getAll());
});
