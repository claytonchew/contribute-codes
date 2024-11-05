import type { SeedStep } from "~~/database/seed/module/Seed";
import { tables } from "~~/server/utils/database";
import userData from "~~/database/seed/data/tests/user.json";
import oAuthAccountData from "~~/database/seed/data/tests/oauth_account.json";
import projectData from "~~/database/seed/data/tests/project.json";
import projectSkillData from "~~/database/seed/data/tests/project_skill.json";
import projectContributorData from "~~/database/seed/data/tests/project_contributor.json";

export default {
  seed: async (tx) => {
    await tx
      .insert(tables.user.user)
      .values(
        userData.map((data) => ({
          id: data.id,
          created_at: new Date(data.created_at * 1000),
          updated_at: new Date(data.updated_at * 1000),
          email: data.email,
          name: data.name,
          avatar: data.avatar,
          banned_at: data.banned_at ? new Date(data.banned_at * 1000) : null,
        })),
      )
      .onConflictDoNothing()
      .run();
    await tx
      .insert(tables.user.oauthAccount)
      .values(
        oAuthAccountData.map((data) => ({
          id: data.id,
          createdAt: new Date(data.created_at * 1000),
          updatedAt: new Date(data.updated_at * 1000),
          userId: data.user_id,
          providerId: data.provider_id,
          providerUserId: data.provider_user_id,
        })),
      )
      .onConflictDoNothing()
      .run();
    await tx
      .insert(tables.project.project)
      .values(
        projectData.map((data) => ({
          id: data.id,
          createdAt: new Date(data.created_at * 1000),
          updatedAt: new Date(data.updated_at * 1000),
          title: data.title,
          content: data.content,
          snippet: data.snippet,
          repositoryUrl: data.repository_url,
          projectUrl: data.project_url,
          ownerId: data.owner_id,
        })),
      )
      .onConflictDoNothing()
      .run();
    await tx
      .insert(tables.project.projectSkill)
      .values(
        projectSkillData.map((data) => ({
          projectId: data.project_id,
          skill: data.skill,
          createdAt: new Date(data.created_at * 1000),
          updatedAt: new Date(data.updated_at * 1000),
        })),
      )
      .onConflictDoNothing()
      .run();
    await tx
      .insert(tables.project.projectContributor)
      .values(
        projectContributorData.map((data) => ({
          projectId: data.project_id,
          userId: data.user_id,
          createdAt: new Date(data.created_at * 1000),
          updatedAt: new Date(data.updated_at * 1000),
        })),
      )
      .onConflictDoNothing()
      .run();
  },
  continueOnError: false,
} as SeedStep;
