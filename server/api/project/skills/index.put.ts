import { projectService } from "~~/server/services/db/ProjectService";
import { projectSchema } from "~~/server/validations/project";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event, {
    statusCode: 401,
    message: "You must be logged in to update a project.",
  });

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
      message: "You do not have permission to update this project.",
    });
  }

  const body = await readValidatedBody(event, (body) =>
    projectSchema.updateSkills.parse(body),
  );

  if (!(await projectService.updateSkills(id as string, body.skills))) {
    throw createError({
      statusCode: 500,
      message: "Failed to update project skills.",
    });
  }

  return createResponse.success(
    await projectService.getSkillsById(id as string),
  );
});
