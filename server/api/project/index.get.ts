import { z } from "zod";
import { projectService } from "~~/server/services/database/ProjectService";
import { parseRepositoryURL } from "~~/app/utils/parser";

export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);

    const { id } = await getValidatedQuery(
      event,
      z.object({ id: z.string() }).parse,
    );

    const project = await projectService.getById(id);

    if (!project) {
      throw createError({
        statusCode: 404,
        statusMessage: "Project not found",
      });
    }

    if (!project.isPublished && project.ownerId !== user?.id) {
      throw createError({
        statusCode: 403,
        statusMessage: "Project not published",
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let contributors: any[] = [];
    try {
      const { platform, repository } = parseRepositoryURL(
        project.repositoryUrl || "",
      );
      if (repository && platform === "github") {
        contributors = await github(
          `${repository.owner}/${repository.name}`,
        ).getContributors();
      }
    } catch {
      contributors = [];
    }

    return {
      ...project,
      contributors: contributors
        .filter((c) => !c.username.endsWith("[bot]"))
        .map(
          (c) =>
            <
              {
                id: string;
                username: string;
                avatar: string;
                contributions: number;
              }
            >{
              id: c.id,
              username: c.username,
              avatar: `https://github.com/${c.username}.png`,
              contributions: c.contributions,
            },
        ),
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
});
