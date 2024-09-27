import { eq } from "drizzle-orm";

class UserService {
  async getById(id: string) {
    try {
      const user = await useDB()
        .select()
        .from(tables.user)
        .where(eq(tables.user.id, id))
        .get();

      return user;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  }

  async getByEmail(email: string) {
    try {
      const user = await useDB()
        .select()
        .from(tables.user)
        .where(eq(tables.user.email, email))
        .get();

      return user;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  }

  async create(data: {
    name: string;
    email: string;
    avatar?: string | null | undefined;
  }) {
    try {
      const user = await useDB()
        .insert(tables.user)
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

  async updateById(
    id: string,
    data: {
      name?: string;
      email?: string;
      id?: string;
      createdAt?: Date;
      updatedAt?: Date;
      avatar?: string | null;
      bannedAt?: Date | null;
    },
  ) {
    try {
      const user = await useDB()
        .update(tables.user)
        .set(data)
        .where(eq(tables.user.id, id))
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
