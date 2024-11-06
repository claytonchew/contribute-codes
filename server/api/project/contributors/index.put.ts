import z from "zod";
import { projectService } from "~~/server/services/database/ProjectService";

import type { InferSelectModel } from "drizzle-orm";

function sendContributorRequestEmails(
  projectId: string,
  newContributors: Array<
    InferSelectModel<typeof tables.user.user> & { acceptedAt: Date | null }
  >,
) {
  const project = projectService.getById(projectId);

  if (!project) {
    throw new Error("Project not found.");
  }

  newContributors.forEach((contributor) => {
    // eslint-disable-next-line no-console
    console.log(contributor);
    // TODO: send email to contributor
    // TODO: send email to owner
  });
}

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

    const { contributorIds } = await readValidatedBody(
      event,
      z.object({ contributorIds: z.string().array() }).parse,
    );

    const records = await projectService.updateContributors(
      id,
      contributorIds,
      user.id,
    );

    // get newly added contributors from records.new
    const contributorsToEmail = records.new.filter(
      (newContributor) =>
        !records.old.some(
          (oldContributor) => oldContributor.id === newContributor.id,
        ) && !newContributor.acceptedAt,
    );
    sendContributorRequestEmails(id, contributorsToEmail);

    return records.new.map((contributor) => ({
      id: contributor.id,
      name: contributor.name,
      email: contributor.email,
      avatar: contributor.avatar,
      acceptedAt: contributor.acceptedAt,
    }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
});
