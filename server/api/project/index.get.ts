import { projectService } from "~~/server/services/database/ProjectService";

export default defineEventHandler(async (event) => {
  try {
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

    return project;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
});
