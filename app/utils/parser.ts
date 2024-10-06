interface ParsedRepository {
  parseOK: boolean;
  platform: "github" | "gitlab" | "bitbucket" | undefined;
  repository?: {
    owner: string;
    name: string;
  };
  originalURL: string;
}

export const parseRepositoryURL = (url: string): ParsedRepository => {
  const githubRegex =
    /^https?:\/\/(?:www\.)?github\.com\/([^/]+)\/([^/]+)(?:\/|$)/;
  const gitlabRegex =
    /^https?:\/\/(?:www\.)?gitlab\.com\/([^/]+)\/([^/]+)(?:\/|$)/;
  const bitbucketRegex =
    /^https?:\/\/(?:www\.)?bitbucket\.org\/([^/]+)\/([^/]+)(?:\/|$)/;

  let match: RegExpExecArray | null;

  if ((match = githubRegex.exec(url))) {
    return {
      parseOK: true,
      platform: "github",
      repository:
        match[1] && match[2]
          ? {
              owner: match[1],
              name: match[2],
            }
          : undefined,
      originalURL: url,
    };
  } else if ((match = gitlabRegex.exec(url))) {
    return {
      parseOK: true,
      platform: "gitlab",
      repository:
        match[1] && match[2]
          ? {
              owner: match[1],
              name: match[2],
            }
          : undefined,
      originalURL: url,
    };
  } else if ((match = bitbucketRegex.exec(url))) {
    return {
      parseOK: true,
      platform: "bitbucket",
      repository:
        match[1] && match[2]
          ? {
              owner: match[1],
              name: match[2],
            }
          : undefined,
      originalURL: url,
    };
  } else {
    return {
      parseOK: false,
      platform: undefined,
      originalURL: url,
    };
  }
};

export const stripURLScheme = (url: string): string => {
  return url.replace(/^(https?:)?\/\//, "").replace(/^http:\/\//, "");
};
