import { eq, and, getTableColumns, isNull } from "drizzle-orm";

class ContributorService {
  /**
   * Obtains a list of contributor requests for a user, along with the requester's information
   *
   * @param userId The ID of the user
   * @returns A promise that resolves to an array of contributor requests
   */
  async getContributorRequests(userId: string) {
    try {
      const contributorRequests = await useDB()
        .select({
          ...getTableColumns(tables.project.projectContributor),
          requester: {
            name: tables.user.user.name,
            avatar: tables.user.user.avatar,
          },
          project: {
            id: tables.project.project.id,
            title: tables.project.project.title,
            snippet: tables.project.project.snippet,
          },
        })
        .from(tables.project.projectContributor)
        .leftJoin(
          tables.project.project,
          eq(
            tables.project.project.id,
            tables.project.projectContributor.projectId,
          ),
        )
        .leftJoin(
          tables.user.user,
          eq(
            tables.user.user.id,
            tables.project.projectContributor.requestedBy,
          ),
        )
        .where(
          and(
            eq(tables.project.projectContributor.userId, userId),
            isNull(tables.project.projectContributor.acceptedAt),
          ),
        );

      return contributorRequests;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return [];
    }
  }

  /**
   * Accepts a contributor request.
   *
   * @param userId The ID of the user
   * @param projectId The ID of the project
   * @returns A promise that resolves to true if the request was accepted
   */
  async acceptContributorRequest(userId: string, projectId: string) {
    try {
      await useDB()
        .update(tables.project.projectContributor)
        .set({
          acceptedAt: new Date(),
        })
        .where(
          and(
            eq(tables.project.projectContributor.userId, userId),
            eq(tables.project.projectContributor.projectId, projectId),
            isNull(tables.project.projectContributor.acceptedAt),
          ),
        );

      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
  }

  /**
   * Declines a contributor request.
   *
   * @param userId The ID of the user
   * @param projectId The ID of the project
   * @returns A promise that resolves to true if the request was declined
   */
  async declineContributorRequest(userId: string, projectId: string) {
    try {
      await useDB()
        .delete(tables.project.projectContributor)
        .where(
          and(
            eq(tables.project.projectContributor.userId, userId),
            eq(tables.project.projectContributor.projectId, projectId),
          ),
        );

      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
  }
}

export const contributorService = new ContributorService();
