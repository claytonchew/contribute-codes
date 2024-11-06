import { z } from "zod";
import { userService } from "~~/server/services/database/UserService";

export default defineEventHandler(async (event) => {
  await requireUserSession(event, {
    statusCode: 401,
    message: "You must be logged in to lookup a user.",
  });

  try {
    const { keyword } = await getValidatedQuery(
      event,
      z.object({ keyword: z.string() }).parse,
    );

    return (await userService.getUsersByKeyword(keyword)).map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
});
