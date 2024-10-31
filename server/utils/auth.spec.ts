import { describe, it, expect } from "vitest";
import { sanitizeUser } from "./auth";
import type { User } from "#auth-utils";
import type { InferSelectModel } from "drizzle-orm";

describe("sanitizeUser", () => {
  it("should return null if user is null", () => {
    const result = sanitizeUser(null);
    expect(result).toBeNull();
  });

  it("should return sanitized user object", () => {
    const user: InferSelectModel<typeof tables.user.user> = {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://some.url/avatar.png",
      bannedAt: new Date(), // sensitive information
      createdAt: new Date(), // sensitive information
      updatedAt: new Date(), // sensitive information
    };

    const expected: User = {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://some.url/avatar.png",
    };

    const result = sanitizeUser(user);
    expect(result).toEqual(expected);
  });

  it("should not include sensitive information in the sanitized user object", () => {
    const user: InferSelectModel<typeof tables.user.user> = {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://some.url/avatar.png",
      bannedAt: new Date(), // sensitive information
      createdAt: new Date(), // sensitive information
      updatedAt: new Date(), // sensitive information
    };

    const result = sanitizeUser(user);
    expect(result).not.toHaveProperty("bannedAt");
    expect(result).not.toHaveProperty("createdAt");
    expect(result).not.toHaveProperty("updatedAt");
  });
});
