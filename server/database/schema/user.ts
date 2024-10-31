import { sqliteTable, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const user = sqliteTable("user", (t) => ({
  id: t
    .text()
    .primaryKey()
    .$default(() => createId()),
  createdAt: t
    .integer({ mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: t
    .integer({ mode: "timestamp" })
    .notNull()
    .$onUpdate(() => new Date()),
  email: t.text().notNull().unique(),
  name: t.text().notNull(),
  avatar: t.text(),
  bannedAt: t.integer({ mode: "timestamp" }),
}));

export const oauthAccount = sqliteTable(
  "oauth_account",
  (t) => ({
    id: t
      .text()
      .primaryKey()
      .$default(() => createId()),
    createdAt: t
      .integer({ mode: "timestamp" })
      .notNull()
      .$default(() => new Date()),
    updatedAt: t
      .integer({ mode: "timestamp" })
      .notNull()
      .$onUpdate(() => new Date()),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    providerId: t.text().notNull(),
    providerUserId: t.text().notNull(),
  }),
  (table) => ({
    providerUserUnique: uniqueIndex("provider_user_unique").on(
      table.providerId,
      table.providerUserId,
    ),
  }),
);
