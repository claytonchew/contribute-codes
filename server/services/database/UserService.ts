import { eq, type InferInsertModel } from "drizzle-orm";

class UserService {
  /**
   * Fetches a user by its id.
   *
   * @param id - user id
   * @returns user | null
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
   * @param email - user email
   * @returns user | null
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
   * @param data - user data
   * @returns user | null
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
   * @param id - user id
   * @param data - user data
   * @returns user | null
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
}

export const userService = new UserService();
