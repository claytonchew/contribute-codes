import { defineConfig } from "drizzle-kit";
const { TURSO_DB_URL, TURSO_DB_TOKEN } = process.env;

if (!TURSO_DB_URL || !TURSO_DB_TOKEN) {
  throw new Error("Turso configuration is missing");
}

export default defineConfig({
  dialect: "turso",
  schema: "./database/schema",
  out: "./database/migrations",
  casing: "snake_case",
  dbCredentials: {
    url: TURSO_DB_URL,
    authToken: TURSO_DB_TOKEN,
  },
  migrations: {
    prefix: "timestamp",
  },
});
