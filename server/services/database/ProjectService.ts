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
   * @param id The ID of the project
   * @returns A promise that resolves to the project or null if not found
   */
  async getById(id: string) {
    try {
      const projectData = await useDB()
        .select({
          project: tables.project.project,
          owner: {
            id: tables.user.user.id,
            name: tables.user.user.name,
            avatar: tables.user.user.avatar,
          },
          onboarding: tables.project.projectOnboarding,
          skills:
            sql<string>`GROUP_CONCAT(${tables.project.projectSkill.skill}, '__,__')`.as(
              "skills",
            ),
        })
        .from(tables.project.project)
        .where(eq(tables.project.project.id, id))
        .innerJoin(
          tables.user.user,
          eq(tables.user.user.id, tables.project.project.ownerId),
        )
        .leftJoin(
          tables.project.projectSkill,
          eq(tables.project.projectSkill.projectId, tables.project.project.id),
        )
        .leftJoin(
          tables.project.projectOnboarding,
          eq(
            tables.project.projectOnboarding.projectId,
            tables.project.project.id,
          ),
        )
        .groupBy(tables.project.project.id)
        .get();

      // if no project found, return null
      if (!projectData) {
        return null;
      }

      // reduce rows into the desired structure
      const project = {
        ...projectData.project,
        owner: projectData.owner,
        skills: projectData.skills ? projectData.skills.split("__,__") : [],
        onboarding: projectData.onboarding,
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
   * Note: This method does not fetch the `content` of the projects.
   *
   * @param options Object containing pageOptions, sort, and filters
   * @param options.pageOptions Pagination options including page and perPage
   * @param options.sort Sorting order, either "newest" or "oldest"
   * @param options.filters Filtering options including skill and/or ownerId
   * @returns A promise that that resolves to an object containing records and pagination
   * @throws Error if query fails
   */
  async getAll(options: ProjectGetAllOptions = {}, includeUnpublished = false) {
    try {
      const { pageOptions, sort, filters } = options;

      let { page = 1, perPage = 20 } = pageOptions || {};
      page = Math.max(page || 1, 1);
      perPage = Math.max(perPage || 20, 1);

      const offset = (page - 1) * perPage;

      // fetch projects (exclude content) with owner and skills
      let query = useDB()
        .select({
          id: tables.project.project.id,
          createdAt: tables.project.project.createdAt,
          updatedAt: tables.project.project.updatedAt,
          title: tables.project.project.title,
          snippet: tables.project.project.snippet,
          repositoryUrl: tables.project.project.repositoryUrl,
          projectUrl: tables.project.project.projectUrl,
          owner: {
            id: tables.user.user.id,
            name: tables.user.user.name,
            avatar: tables.user.user.avatar,
          },
          skills:
            sql<string>`GROUP_CONCAT(${tables.project.projectSkill.skill}, '__,__')`.as(
              "skills",
            ),
        })
        .from(tables.project.project)
        .innerJoin(
          tables.user.user,
          eq(tables.user.user.id, tables.project.project.ownerId),
        )
        .leftJoin(
          tables.project.projectSkill,
          eq(tables.project.projectSkill.projectId, tables.project.project.id),
        )
        .groupBy(tables.project.project.id)
        .$dynamic();

      query =
        sort === "oldest"
          ? query.orderBy(asc(tables.project.project.createdAt))
          : query.orderBy(desc(tables.project.project.createdAt)); // default to newest

      const conditions = [];

      if (!includeUnpublished) {
        conditions.push(eq(tables.project.project.isPublished, true));
      }

      // apply filters
      if (filters?.skill || filters?.ownerId) {
        if (filters.skill) {
          conditions.push(
            exists(
              useDB()
                .select()
                .from(tables.project.projectSkill)
                .where(
                  and(
                    eq(
                      tables.project.projectSkill.projectId,
                      tables.project.project.id,
                    ),
                    eq(tables.project.projectSkill.skill, filters.skill),
                  ),
                ),
            ),
          );
        }
        if (filters.ownerId) {
          conditions.push(eq(tables.project.project.ownerId, filters.ownerId));
        }
      }

      if (conditions.length) {
        query = query.where(and(...conditions));
      }
      const rows = await query.limit(perPage).offset(offset).all();

      // get total count of projects
      let totalCountQuery = useDB()
        .select({
          count: sql<number>`COUNT(DISTINCT ${tables.project.project.id})`.as(
            "count",
          ),
        })
        .from(tables.project.project)
        .leftJoin(
          tables.project.projectSkill,
          eq(tables.project.projectSkill.projectId, tables.project.project.id),
        )
        .$dynamic();

      if (conditions.length) {
        totalCountQuery = totalCountQuery.where(and(...conditions));
      }

      const totalCountResult = await totalCountQuery.get();
      const count = totalCountResult?.count || 0;

      const projects = rows.map((row) => ({
        ...row,
        skills: row.skills ? row.skills.split("__,__") : [],
      }));

      return {
        records: projects,
        pagination: {
          page,
          perPage,
          total: count,
        },
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
  }

  /**
   * Fetches all projects by the owner's id.
   *
   * @param ownerId The user ID of the owner
   * @returns A promise that resolves to an array of projects
   */
  async getAllByOwnerId(ownerId: string) {
    try {
      const projects = await useDB()
        .select({
          id: tables.project.project.id,
          createdAt: tables.project.project.createdAt,
          updatedAt: tables.project.project.updatedAt,
          title: tables.project.project.title,
          snippet: tables.project.project.snippet,
          repositoryUrl: tables.project.project.repositoryUrl,
          projectUrl: tables.project.project.projectUrl,
          owner: {
            id: tables.user.user.id,
            name: tables.user.user.name,
            avatar: tables.user.user.avatar,
          },
          skills:
            sql<string>`GROUP_CONCAT(${tables.project.projectSkill.skill}, '__,__')`.as(
              "skills",
            ),
          isPublished: tables.project.project.isPublished,
        })
        .from(tables.project.project)
        .innerJoin(
          tables.user.user,
          eq(tables.user.user.id, tables.project.project.ownerId),
        )
        .leftJoin(
          tables.project.projectSkill,
          eq(tables.project.projectSkill.projectId, tables.project.project.id),
        )
        .groupBy(tables.project.project.id)
        .where(eq(tables.project.project.ownerId, ownerId))
        .all();

      return projects.map((row) => ({
        ...row,
        skills: row.skills ? row.skills.split("__,__") : [],
      }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return [];
    }
  }

  /**
   * Fetches all skills of a project by its id.
   *
   * @param id The ID of the project
   * @returns A promise that resolves to an array of skills
   * @throws Error if query fails
   */
  async getSkillsById(id: string) {
    try {
      const skills = await useDB()
        .select({
          skill: tables.project.projectSkill.skill,
        })
        .from(tables.project.projectSkill)
        .where(eq(tables.project.projectSkill.projectId, id))
        .all();

      return skills.map((row) => row.skill);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
  }

  /**
   * Create a new project
   *
   * @param data The data of the project to create
   * @returns A promise that resolves to the created project or null if failed
   */
  async create(data: InferInsertModel<typeof tables.project.project>) {
    try {
      const project = await useDB()
        .insert(tables.project.project)
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
   * @param id The ID of the project
   * @param data The data of the project to update
   * @returns A promise that resolves to the updated project or null if failed
   */
  async update(
    id: string,
    data: Partial<
      Omit<
        InferInsertModel<typeof tables.project.project>,
        "id" | "createdAt" | "updatedAt"
      >
    >,
  ) {
    try {
      const project = await useDB()
        .update(tables.project.project)
        .set({
          ...data,
          id,
        })
        .where(eq(tables.project.project.id, id))
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
   * @param id The ID of the project
   * @param skills The list of skills to update
   * @returns A promise that resolves to an array of updated skills
   * @throws Error if update fails
   */
  async updateSkills(id: string, skills: string[]) {
    try {
      const records = await useDB().transaction(async (tx) => {
        // remove existing skills
        await tx
          .delete(tables.project.projectSkill)
          .where(eq(tables.project.projectSkill.projectId, id));

        // insert new skills
        const newSkills = await tx
          .insert(tables.project.projectSkill)
          .values(
            skills.map((skill) => ({
              projectId: id,
              skill,
            })),
          )
          .returning()
          .all();

        return newSkills;
      });

      return records;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
  }

  /**
   * Delete a project
   *
   * @param id The ID of the project
   * @returns A promise that resolves to deleted record.
   * @throws Error if query fails
   */
  async delete(id: string) {
    try {
      const record = await useDB()
        .delete(tables.project.project)
        .where(eq(tables.project.project.id, id))
        .returning()
        .get();

      return record;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
  }

  /**
   * Check if a user is the owner of a project
   *
   * @param id The ID of the project
   * @param userId The ID of the user to check against
   * @returns A promise that resolves to a boolean indicating if the user is the owner
   */
  async isOwner(id: string, userId: string) {
    try {
      const project = await useDB()
        .select({
          id: tables.project.project.id,
        })
        .from(tables.project.project)
        .where(
          and(
            eq(tables.project.project.id, id),
            eq(tables.project.project.ownerId, userId),
          ),
        )
        .get();

      return !!project;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
    }
  }

  /**
   * Create or update project onboarding of a project.
   *
   * @param id The ID of the project
   * @param data The data of the project onboarding to update or insert
   * @returns A promise that resolves to the updated or inserted project onboarding
   * @throws Error if query fails
   */
  async upsertProjectOnboarding(
    id: string,
    data: Partial<
      Omit<
        InferInsertModel<typeof tables.project.projectOnboarding>,
        "projectId" | "createdAt" | "updatedAt"
      >
    >,
  ) {
    try {
      const projectOnboarding = await useDB()
        .insert(tables.project.projectOnboarding)
        .values({
          ...data,
          projectId: id,
        })
        .onConflictDoUpdate({
          target: tables.project.projectOnboarding.projectId,
          set: {
            ...data,
            projectId: id,
          },
        })
        .returning()
        .get();

      return projectOnboarding;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
  }
}

export interface ProjectGetAllOptions {
  pageOptions?: { page?: number; perPage?: number };
  sort?: "newest" | "oldest";
  filters?: { skill?: string; ownerId?: string };
}

export const projectService = new ProjectService();
