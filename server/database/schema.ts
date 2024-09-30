import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const user = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$default(() => createId()),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdate(() => new Date()),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  bannedAt: integer("banned_at", { mode: "timestamp" }),
});

export const oauthAccount = sqliteTable(
  "oauth_account",
  {
    id: text("id")
      .primaryKey()
      .$default(() => createId()),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$default(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$onUpdate(() => new Date()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    providerId: text("provider_id").notNull(),
    providerUserId: text("provider_user_id").notNull(),
  },
  (table) => ({
    providerUserUnique: uniqueIndex("provider_user_unique").on(
      table.providerId,
      table.providerUserId,
    ),
  }),
);

export const project = sqliteTable("project", {
  id: text("id")
    .primaryKey()
    .$default(() => createId()),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdate(() => new Date()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  snippet: text("snippet").notNull(),
  repositoryUrl: text("repository_url"),
  projectUrl: text("project_url"),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const skill = sqliteTable("skill", {
  name: text("name").primaryKey().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdate(() => new Date()),
});

export const projectSkill = sqliteTable(
  "project_skill",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    skill: text("skill")
      .notNull()
      .references(() => skill.name, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$default(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    primaryKey: primaryKey({ columns: [table.projectId, table.skill] }),
  }),
);

export const projectContributor = sqliteTable(
  "project_contributor",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$default(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    primaryKey: primaryKey({ columns: [table.projectId, table.userId] }),
  }),
);
