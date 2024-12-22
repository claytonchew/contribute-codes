import { z } from "zod";
import { projectService } from "~~/server/services/database/ProjectService";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event, {
    statusCode: 401,
    message: "You must be logged in to publish a project.",
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
        message: "You do not have permission to publish this project.",
      });
    }
    const project = await projectService.update(id, {
      isPublished: true,
    });

    if (!project) {
      throw createError({
        statusCode: 500,
        message: "Failed to publish project",
      });
    }

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
});
