import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import { useDB } from "./db";
import { createClient } from "@libsql/client/http";
import { drizzle } from "drizzle-orm/libsql";

vi.mock("@libsql/client/http");
vi.mock("drizzle-orm/libsql");

describe("useDB", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    delete process.env.TURSO_DB_URL;
    delete process.env.TURSO_DB_TOKEN;
  });

  it("should throw an error if TURSO_DB_URL or TURSO_DB_TOKEN is missing", () => {
    expect(() => useDB()).toThrow("Turso configuration is missing");
  });

  it("should create a new database client if not already created", () => {
    process.env.TURSO_DB_URL = "test_url";
    process.env.TURSO_DB_TOKEN = "test_token";

    const mockClient = {};
    (createClient as Mock).mockReturnValue(mockClient);
    const mockDrizzle = {};
    (drizzle as Mock).mockReturnValue(mockDrizzle);

    const db = useDB();

    expect(createClient).toHaveBeenCalledWith({
      url: "test_url",
      authToken: "test_token",
    });
    expect(drizzle).toHaveBeenCalledWith(mockClient, { casing: "snake_case" });
    expect(db).toBe(mockDrizzle);
  });

  it("should return the existing database client if already created", () => {
    process.env.TURSO_DB_URL = "test_url";
    process.env.TURSO_DB_TOKEN = "test_token";

    const mockClient = {};
    (createClient as Mock).mockReturnValue(mockClient);
    const mockDrizzle = {};
    (drizzle as Mock).mockReturnValue(mockDrizzle);

    const db1 = useDB();
    const db2 = useDB();

    expect(createClient).toHaveBeenCalledTimes(0);
    expect(drizzle).toHaveBeenCalledTimes(0);
    expect(db1).toBe(db2);
  });
});
