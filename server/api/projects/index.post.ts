import { projectService } from "~~/server/services/database/ProjectService";
import { projectGetAllOptionsSchema } from "~~/validation/project";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, projectGetAllOptionsSchema.parse);

  return await projectService.getAll(body);
});
