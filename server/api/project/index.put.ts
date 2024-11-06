import { z } from "zod";
import { projectService } from "~~/server/services/database/ProjectService";
import { projectSchema } from "~~/validation/project";

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
        message: "You do not have permission to update this project.",
      });
    }

    const body = await readValidatedBody(event, projectSchema.parse);

    // generate snippet
    const snippet = stripMarkdown(body.content, {
      flattenLineToSingleSpace: true,
    }).slice(0, 255);

    const project = await projectService.update(id, {
      ...body,
      snippet,
    });

    if (!project) {
      throw createError({
        statusCode: 500,
        message: "Failed to update project",
      });
    }

    if (body.skills) {
      await projectService.updateSkills(project.id, body.skills);
    }

    return {
      ...project,
      skills: body.skills,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
});
