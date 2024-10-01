import {
  projectService,
  type ProjectGetAllOptions,
} from "~~/server/services/db/ProjectService";

export default defineEventHandler(async (event) => {
  const body: ProjectGetAllOptions | undefined =
    (await readBody(event)) || undefined;

  return createResponse.raw(await projectService.getAll(body));
});
