import { projectService } from "~~/server/services/db/ProjectService";

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Missing required parameter `id`",
    });
  }

  const project = await projectService.getById(id as string);

  if (!project) {
    throw createError({
      statusCode: 404,
      message: "Project not found",
    });
  }

  return createResponse.success(project);
});
