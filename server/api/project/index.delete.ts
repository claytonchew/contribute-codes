import { projectService } from "~~/server/services/database/ProjectService";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event, {
    statusCode: 401,
    message: "You must be logged in to update a project.",
  });

  try {
    const { id } = getQuery(event);
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "Missing required parameter `id`",
      });
    }

    const isOwner = await projectService.isOwner(id as string, user.id);
    if (!isOwner) {
      throw createError({
        statusCode: 403,
        message: "You do not have permission to delete this project.",
      });
    }

    return await projectService.delete(id as string);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
});
