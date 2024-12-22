import { z } from "zod";
import { projectOnboardingSchema } from "~~/validation/project";
import { projectService } from "~~/server/services/database/ProjectService";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event, {
    statusCode: 401,
    message: "You must be logged in to update project onboarding.",
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
        message: "You do not have permission to update project onboarding.",
      });
    }

    const body = await readValidatedBody(event, projectOnboardingSchema.parse);

    return await projectService.upsertProjectOnboarding(id, body);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
});
