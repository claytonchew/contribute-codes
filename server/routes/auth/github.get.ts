import { userService } from "~~/server/services/database/UserService";
import { authService } from "~~/server/services/database/AuthService";
import { sanitizeUser } from "~~/server/utils/auth";

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user }) {
    const oauthAccount: {
      name: string;
      email: string;
      avatar: string | null;
      providerId: "github";
      providerUserId: string;
    } = {
      name: user.name,
      email: user.email,
      avatar: user.avatar_url,
      providerId: "github",
      providerUserId: user.id,
    };

    const dbUser = await handleOAuthLogin(oauthAccount);

    if (dbUser?.bannedAt && dbUser.bannedAt < new Date()) {
      throw createError({
        statusCode: 403,
        statusMessage: "Your account has been banned.",
      });
    }

    // set the user session after successful login
    await setUserSession(event, { user: sanitizeUser(dbUser) ?? undefined });

    // obtain the redirect path from the cookie and delete it
    const redirectPath = getCookie(event, `redirect-path`);
    deleteCookie(event, "redirect-path");

    return sendRedirect(event, redirectPath || "/");
  },
  onError(event, error) {
    // eslint-disable-next-line no-console
    console.error("GitHub OAuth handler error:", error);
    return sendRedirect(event, "/");
  },
});

async function handleOAuthLogin(oauthAccount: {
  name: string;
  email: string;
  avatar: string | null;
  providerId: "github";
  providerUserId: string;
}) {
  let user = await userService.getByEmail(oauthAccount.email);

  if (!user) {
    user = await userService.create({
      name: oauthAccount.name,
      email: oauthAccount.email,
      avatar: oauthAccount.avatar,
    });
  } else if (!user.avatar) {
    user = await userService.update(user.id, {
      avatar: oauthAccount.avatar,
    });
  }

  await authService.linkOAuthAccount(
    user!.id,
    oauthAccount.providerId,
    oauthAccount.providerUserId,
  );

  return user;
}
