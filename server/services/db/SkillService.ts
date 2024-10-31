import { asc } from "drizzle-orm";

class SkillService {
  /**
   * Fetches all skills, ordered by name (asc).
   *
   * @returns skills[]
   */
  public async getAll() {
    try {
      const skillsData = await useDB()
        .select({
          name: tables.skill.skill.name,
        })
        .from(tables.skill.skill)
        .orderBy(asc(tables.skill.skill.name))
        .all();

      return skillsData.map((skill) => skill.name);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return [];
    }
  }
}

export const skillService = new SkillService();
