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
   * Fetches all projects with pagination, sorting, and filtering.
   *
   * Note: This method does not fetch the `content` and `contributors` of the projects.
   *
   * @param options - object containing pageOptions, sort, and filters
   * @param options.pageOptions - pagination options including page and perPage
   * @param options.sort - sorting order, either "newest" or "oldest"
   * @param options.filters - filtering options including skill and/or ownerId
   * @returns object containing data (list of projects) and pagination details
   */
  async getAll(options: ProjectGetAllOptions = {}) {
    try {
      const { pageOptions, sort, filters } = options;

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
   * Fetches all skills of a project by its id.
   *
   * @param id - project id
   * @returns list of skills
   */
  async getSkillsById(id: string) {
    try {
      const skills = await useDB()
        .select({
          skill: tables.projectSkill.skill,
        })
        .from(tables.projectSkill)
        .where(eq(tables.projectSkill.projectId, id))
        .all();

      return skills.map((row) => row.skill);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  }

  /**
   * Fetches all contributors of a project by its id.
   *
   * @param id - project id
   * @returns list of contributors
   */
  async getContributorsById(id: string) {
    try {
      const contributors = await useDB()
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

      return contributors;
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
        // remove existing skills
        await tx
          .delete(tables.projectSkill)
          .where(eq(tables.projectSkill.projectId, id));

        // insert new skills
        for (const skill of skills) {
          await tx.insert(tables.projectSkill).values({
            projectId: id,
            skill,
          });
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
        // remove existing contributors
        await tx
          .delete(tables.projectContributor)
          .where(eq(tables.projectContributor.projectId, id));

        // insert new contributors
        for (const userId of contributors) {
          await tx.insert(tables.projectContributor).values({
            projectId: id,
            userId,
          });
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
   * Delete a project
   *
   * @param id - project id
   * @returns boolean
   */
  async delete(id: string) {
    try {
      await useDB().delete(tables.project).where(eq(tables.project.id, id));

      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
    }
  }

  /**
   * Check if a user is the owner of a project
   *
   * @param id - project id
   * @param userId - user id
   * @returns boolean
   */
  async isOwner(id: string, userId: string) {
    try {
      const project = await useDB()
        .select({
          id: tables.project.id,
        })
        .from(tables.project)
        .where(
          and(eq(tables.project.id, id), eq(tables.project.ownerId, userId)),
        )
        .get();

      return !!project;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
    }
  }
}

export interface ProjectGetAllOptions {
  pageOptions?: { page?: number | null; perPage?: number | null } | null;
  sort?: "newest" | "oldest" | null;
  filters?: { skill?: string; ownerId?: string } | null;
}

export const projectService = new ProjectService();
