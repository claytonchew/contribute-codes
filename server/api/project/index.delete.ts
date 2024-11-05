import { z } from "zod";
import { projectService } from "~~/server/services/database/ProjectService";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event, {
    statusCode: 401,
    message: "You must be logged in to update a project.",
  });

  try {
    const { id } = await getValidatedQuery(
      event,
      z.object({ id: z.string() }).parse,
    );

    const isOwner = await projectService.isOwner(id, user.id);

    if (!isOwner) {
      throw createError({
        statusCode: 403,
        message: "You do not have permission to delete this project.",
      });
    }

    return await projectService.delete(id);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
});
