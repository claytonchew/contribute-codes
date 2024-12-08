import { z } from "zod";
import { contributorService } from "~~/server/services/database/ContributorService";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event, {
    statusCode: 401,
    message: "You must be logged in to accept a contributor request.",
  });

  const { projectId } = await getValidatedQuery(
    event,
    z.object({ projectId: z.string() }).parse,
  );

  await contributorService.declineContributorRequest(user.id, projectId);
});
