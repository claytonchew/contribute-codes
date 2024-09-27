class AuthService {
  async linkOAuthAccount(
    userId: string,
    providerId: string,
    providerUserId: string,
  ) {
    try {
      const oauthAccount = await useDB()
        .insert(tables.oauthAccount)
        .values({
          userId,
          providerId,
          providerUserId,
        })
        .onConflictDoNothing()
        .returning()
        .get();

      return oauthAccount;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  }
}

export const authService = new AuthService();
