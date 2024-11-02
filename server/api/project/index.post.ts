import { projectService } from "~~/server/services/database/ProjectService";
import { projectSchema } from "~~/validation/project";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event, {
    statusCode: 401,
    message: "You must be logged in to create a project.",
  });

  try {
    const body = await readValidatedBody(event, projectSchema.parse);

    // generate snippet
    const snippet = stripMarkdown(body.content, {
      flattenLineToSingleSpace: true,
    }).slice(0, 255);

    const project = await projectService.create({
      ...body,
      snippet,
      ownerId: user.id,
    });

    if (!project) {
      throw createError({
        statusCode: 500,
        message: "Failed to create project",
      });
    }

    if (body.skills) {
      await projectService.updateSkills(project.id, body.skills);
    }

    return project;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
});
