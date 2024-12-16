export const github = (repo: `${string}/${string}`) => ({
  getContributors: async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await $fetch(
        `https://ungh.cc/repos/${repo}/contributors`,
      );

      return data.contributors;
    } catch {
      return [];
    }
  },
});
