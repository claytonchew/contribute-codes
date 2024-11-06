import { eq, like, or, type InferInsertModel } from "drizzle-orm";

class UserService {
  /**
   * Fetches a user by its id.
   *
   * @param id The ID of the user to fetch.
   * @returns A promise that resolves to the user or null if not found.
   */
  async getById(id: string) {
    try {
      const user = await useDB()
        .select()
        .from(tables.user.user)
        .where(eq(tables.user.user.id, id))
        .get();

      return user;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  }

  /**
   * Fetches a user by its email.
   *
   * @param email The email of the user to fetch.
   * @returns A promise that resolves to the user or null if not found.
   */
  async getByEmail(email: string) {
    try {
      const user = await useDB()
        .select()
        .from(tables.user.user)
        .where(eq(tables.user.user.email, email))
        .get();

      return user;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  }

  /**
   * Creates a new user.
   *
   * @param data The data of the user to create.
   * @returns A promise that resolves to the created user or null if an error occurred.
   */
  async create(data: {
    name: string;
    email: string;
    avatar?: string | null | undefined;
  }) {
    try {
      const user = await useDB()
        .insert(tables.user.user)
        .values(data)
        .returning()
        .get();

      return user;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  }

  /**
   * Updates a user by its id.
   *
   * @param id The ID of the user to update.
   * @param data The data of the user to update.
   * @returns A promise that resolves to the updated user or null if an error occurred.
   */
  async update(
    id: string,
    data: Partial<InferInsertModel<typeof tables.user.user>>,
  ) {
    try {
      const user = await useDB()
        .update(tables.user.user)
        .set({
          ...data,
          id,
        })
        .where(eq(tables.user.user.id, id))
        .returning()
        .get();

      return user;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  }

  /**
   * Fetches users by a keyword.
   *
   * @param keyword The keyword that matches the user's name or email.
   * @returns A promise that resolves to the users or an empty array if not found.
   */
  async getUsersByKeyword(keyword: string) {
    try {
      const users = await useDB()
        .select()
        .from(tables.user.user)
        .where(
          or(
            like(tables.user.user.name, `%${keyword}%`),
            like(tables.user.user.email, `%${keyword}%`),
          ),
        )
        .all();

      return users;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return [];
    }
  }
}

export const userService = new UserService();
