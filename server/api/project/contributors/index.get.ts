import { z } from "zod";
import { projectService } from "~~/server/services/database/ProjectService";

export default defineEventHandler(async (event) => {
  await requireUserSession(event, {
    statusCode: 401,
    message: "You must be logged in to get contributors.",
  });

  const { id } = await getValidatedQuery(
    event,
    z.object({ id: z.string() }).parse,
  );

  return (await projectService.getContributorsById(id)).map((contributor) => ({
    id: contributor.id,
    name: contributor.name,
    email: contributor.email,
    avatar: contributor.avatar,
    acceptedAt: contributor.acceptedAt,
    requestedBy: contributor.requestedBy,
  }));
});
