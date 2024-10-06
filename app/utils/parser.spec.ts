import { describe, it, expect } from "vitest";
import { parseRepositoryURL } from "./parser";

describe("parseRepositoryURL", () => {
  it("should parse a valid GitHub URL", () => {
    const url = "https://github.com/owner/repo";
    const result = parseRepositoryURL(url);
    expect(result).toEqual({
      parseOK: true,
      platform: "github",
      repository: {
        owner: "owner",
        name: "repo",
      },
      originalURL: url,
    });
  });

  it("should parse a valid GitLab URL", () => {
    const url = "https://gitlab.com/owner/repo";
    const result = parseRepositoryURL(url);
    expect(result).toEqual({
      parseOK: true,
      platform: "gitlab",
      repository: {
        owner: "owner",
        name: "repo",
      },
      originalURL: url,
    });
  });

  it("should parse a valid Bitbucket URL", () => {
    const url = "https://bitbucket.org/owner/repo";
    const result = parseRepositoryURL(url);
    expect(result).toEqual({
      parseOK: true,
      platform: "bitbucket",
      repository: {
        owner: "owner",
        name: "repo",
      },
      originalURL: url,
    });
  });

  it("should return parseOK false for an invalid URL", () => {
    const url = "https://invalid.com/owner/repo";
    const result = parseRepositoryURL(url);
    expect(result).toEqual({
      parseOK: false,
      platform: undefined,
      originalURL: url,
    });
  });

  it("should return parseOK false for a malformed URL", () => {
    const url = "not-a-valid-url";
    const result = parseRepositoryURL(url);
    expect(result).toEqual({
      parseOK: false,
      platform: undefined,
      originalURL: url,
    });
  });
});
