import { z } from "zod";
import { projectService } from "~~/server/services/database/ProjectService";

export default defineEventHandler(async (event) => {
  try {
    const { id } = await getValidatedQuery(
      event,
      z.object({ id: z.string() }).parse,
    );

    const project = await projectService.getById(id);

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
