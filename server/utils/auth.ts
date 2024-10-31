import type { User } from "#auth-utils";
import type { InferSelectModel } from "drizzle-orm";

/**
 * Sanitizes a user object by removing sensitive information.
 *
 * @param user - the user object to be sanitized
 * @returns the sanitized user object
 */
export const sanitizeUser = (
  user: InferSelectModel<typeof tables.user.user> | null,
): User | null => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
};
