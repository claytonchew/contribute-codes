import { sqliteTable } from "drizzle-orm/sqlite-core";

export const skill = sqliteTable("skill", (t) => ({
  name: t.text().primaryKey().notNull(),
  createdAt: t
    .integer({ mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: t
    .integer({ mode: "timestamp" })
    .notNull()
    .$onUpdate(() => new Date()),
}));
