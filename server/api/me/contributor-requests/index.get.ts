import { contributorService } from "~~/server/services/database/ContributorService";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event, {
    statusCode: 401,
    message: "You must be logged in to get contributor requests.",
  });

  return await contributorService.getContributorRequests(user.id);
});
