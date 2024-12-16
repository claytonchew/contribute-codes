import { sqliteTable, primaryKey } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import * as user from "./user";
import * as skill from "./skill";

export const project = sqliteTable("project", (t) => ({
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
  title: t.text().notNull(),
  content: t.text().notNull(),
  snippet: t.text().notNull(),
  repositoryUrl: t.text(),
  projectUrl: t.text(),
  ownerId: t
    .text()
    .notNull()
    .references(() => user.user.id, { onDelete: "cascade" }),
}));

export const projectSkill = sqliteTable(
  "project_skill",
  (t) => ({
    projectId: t
      .text()
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    skill: t
      .text()
      .notNull()
      .references(() => skill.skill.name, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    createdAt: t
      .integer({ mode: "timestamp" })
      .notNull()
      .$default(() => new Date()),
    updatedAt: t
      .integer({ mode: "timestamp" })
      .notNull()
      .$onUpdate(() => new Date()),
  }),
  (table) => ({
    primaryKey: primaryKey({ columns: [table.projectId, table.skill] }),
  }),
);
