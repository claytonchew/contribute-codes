import {
  sql,
  eq,
  desc,
  asc,
  exists,
  and,
  type InferInsertModel,
} from "drizzle-orm";

class ProjectService {
  /**
   * Fetches a project by its id.
   *
   * @param id - project id
   * @returns project | null
   */
  async getById(id: string) {
    try {
      const projectData = await useDB()
        .select({
          project: tables.project,
          owner: {
            id: tables.user.id,
            name: tables.user.name,
            avatar: tables.user.avatar,
          },
          skills:
            sql<string>`GROUP_CONCAT(${tables.projectSkill.skill}, '__,__')`.as(
              "skills",
            ),
        })
        .from(tables.project)
        .where(eq(tables.project.id, id))
        .innerJoin(tables.user, eq(tables.user.id, tables.project.ownerId))
        .leftJoin(
          tables.projectSkill,
          eq(tables.projectSkill.projectId, tables.project.id),
        )
        .groupBy(tables.project.id)
        .get();

      // if no project found, return null
      if (!projectData) {
        return null;
      }

      const contributorsData = await useDB()
        .select({
          id: tables.user.id,
          name: tables.user.name,
          avatar: tables.user.avatar,
        })
        .from(tables.projectContributor)
        .where(eq(tables.projectContributor.projectId, id))
        .innerJoin(
          tables.user,
          eq(tables.user.id, tables.projectContributor.userId),
        )
        .all();

      // reduce rows into the desired structure
      const project = {
        ...projectData.project,
        owner: projectData.owner,
        skills: projectData.skills ? projectData.skills.split("__,__") : [],
        contributors: contributorsData,
      };

      return project;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  }

  /**
   * Fetches all projects with pagination, sorting, and filtering
   *
   * Note: This method does not fetch the `content` and `contributors` of the projects
   *
   * @param pageOptions - page and perPage
   * @param sort - newest or oldest
   * @param filters - skill and/or ownerId
   * @returns projects with pagination
   */
  async getAll(
    pageOptions?: { page?: number | null; perPage?: number | null } | null,
    sort?: "newest" | "oldest" | null,
    filters?: { skill?: string; ownerId?: string } | null,
  ) {
    try {
      let { page = 1, perPage = 20 } = pageOptions || {};
      page = Math.max(page || 1, 1);
      perPage = Math.max(perPage || 20, 1);

      const offset = (page - 1) * perPage;

      // fetch projects (exclude content) with owner and skills
      let query = useDB()
        .select({
          id: tables.project.id,
          createdAt: tables.project.createdAt,
          updatedAt: tables.project.updatedAt,
          title: tables.project.title,
          snippet: tables.project.snippet,
          repositoryUrl: tables.project.repositoryUrl,
          projectUrl: tables.project.projectUrl,
          owner: {
            id: tables.user.id,
            name: tables.user.name,
            avatar: tables.user.avatar,
          },
          skills:
            sql<string>`GROUP_CONCAT(${tables.projectSkill.skill}, '__,__')`.as(
              "skills",
            ),
        })
        .from(tables.project)
        .innerJoin(tables.user, eq(tables.user.id, tables.project.ownerId))
        .leftJoin(
          tables.projectSkill,
          eq(tables.projectSkill.projectId, tables.project.id),
        )
        .groupBy(tables.project.id)
        .$dynamic();

      query =
        sort === "oldest"
          ? query.orderBy(asc(tables.project.createdAt))
          : query.orderBy(desc(tables.project.createdAt)); // default to newest

      // apply filters
      if (filters?.skill || filters?.ownerId) {
        const conditions = [];
        if (filters.skill) {
          conditions.push(
            exists(
              useDB()
                .select()
                .from(tables.projectSkill)
                .where(
                  and(
                    eq(tables.projectSkill.projectId, tables.project.id),
                    eq(tables.projectSkill.skill, filters.skill),
                  ),
                ),
            ),
          );
        }
        if (filters.ownerId) {
          conditions.push(eq(tables.project.ownerId, filters.ownerId));
        }
        query = query.where(and(...conditions));
      }

      const rows = await query.limit(perPage).offset(offset).all();

      // get total count of projects
      let totalCountQuery = useDB()
        .select({
          count: sql<number>`COUNT(DISTINCT ${tables.project.id})`.as("count"),
        })
        .from(tables.project)
        .leftJoin(
          tables.projectSkill,
          eq(tables.projectSkill.projectId, tables.project.id),
        )
        .$dynamic();

      // apply filters
      if (filters?.skill || filters?.ownerId) {
        const conditions = [];
        if (filters.skill) {
          conditions.push(
            exists(
              useDB()
                .select()
                .from(tables.projectSkill)
                .where(
                  and(
                    eq(tables.projectSkill.projectId, tables.project.id),
                    eq(tables.projectSkill.skill, filters.skill),
                  ),
                ),
            ),
          );
        }
        if (filters.ownerId) {
          conditions.push(eq(tables.project.ownerId, filters.ownerId));
        }
        totalCountQuery = totalCountQuery.where(and(...conditions));
      }

      const totalCountResult = await totalCountQuery.get();
      const count = totalCountResult?.count || 0;

      const projects = rows.map((row) => ({
        ...row,
        skills: row.skills ? row.skills.split("__,__") : [],
      }));

      return {
        data: projects,
        pagination: {
          page,
          perPage,
          total: count,
        },
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  }

  /**
   * Create a new project
   *
   * @param data - project data
   * @returns project | null
   */
  async create(data: InferInsertModel<typeof tables.project>) {
    try {
      const project = await useDB()
        .insert(tables.project)
        .values(data)
        .returning()
        .get();

      return project;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  }

  /**
   * Update a project
   *
   * @param id - project id
   * @param data - project data
   * @returns project | null
   */
  async update(
    id: string,
    data: Partial<InferInsertModel<typeof tables.project>>,
  ) {
    try {
      const project = await useDB()
        .update(tables.project)
        .set({
          ...data,
          id,
        })
        .where(eq(tables.project.id, id))
        .returning()
        .get();

      return project;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  }

  /**
   * Update project skills
   *
   * @param id - project id
   * @param skills - list of skills
   * @returns boolean
   */
  async updateSkills(id: string, skills: string[]) {
    try {
      await useDB().transaction(async (tx) => {
        for (const skill of skills) {
          await tx
            .insert(tables.projectSkill)
            .values({
              projectId: id,
              skill,
            })
            .onConflictDoNothing();
        }
      });

      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
    }
  }

  /**
   * Update project contributors
   *
   * @param id - project id
   * @param contributors - list of contributors user ids
   * @returns boolean
   */
  async updateContributors(id: string, contributors: string[]) {
    try {
      await useDB().transaction(async (tx) => {
        for (const userId of contributors) {
          await tx
            .insert(tables.projectContributor)
            .values({
              projectId: id,
              userId,
            })
            .onConflictDoNothing();
        }
      });

      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
    }
  }
}

export const projectService = new ProjectService();
