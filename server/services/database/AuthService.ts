class AuthService {
  /**
   * Link OAuth account to user
   *
   * @param userId The ID of the user to link the OAuth account to
   * @param providerId The ID of the provider
   * @param providerUserId The ID associated with the user on the OAuth provider
   * @returns oauthAccount | null
   */
  async linkOAuthAccount(
    userId: string,
    providerId: "github",
    providerUserId: string,
  ) {
    try {
      const oauthAccount = await useDB()
        .insert(tables.user.oauthAccount)
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
