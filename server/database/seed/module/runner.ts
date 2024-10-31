import type { SeedRunner } from "./Seed";

export const defineSeedRunner = (seedRunner: SeedRunner) => {
  if (seedRunner.versions && Object.keys(seedRunner.versions).length) {
    const versions = new Set<number>();

    // check for duplicate versions
    for (const version in seedRunner.versions) {
      if (versions.has(Number(version))) {
        throw new Error(`Duplicate version ${version} in seed runners`);
      }

      versions.add(Number(version));
    }

    // check for missing versions in between
    const sortedVersions = Array.from(versions).sort();

    for (let i = 0; i < sortedVersions.length - 1; i++) {
      if (sortedVersions[i + 1] - sortedVersions[i] > 1) {
        throw new Error(
          `Missing version between ${sortedVersions[i]} and ${sortedVersions[i + 1]}`,
        );
      }
    }

    // check if is valid function
    for (const version in seedRunner.versions) {
      for (const step of seedRunner.versions[Number(version)]) {
        if (typeof step.seed !== "function") {
          throw new Error(`Invalid seed function for version ${version}`);
        }
      }
    }
  }

  if (seedRunner.jobs) {
    for (const jobId in seedRunner.jobs) {
      for (const step of seedRunner.jobs[jobId].steps) {
        if (typeof step.seed !== "function") {
          throw new Error(`Invalid seed function for job ${jobId}`);
        }
      }
    }

    for (const jobId in seedRunner.jobs) {
      if (seedRunner.jobs[jobId].dependsOn) {
        for (const dependency of seedRunner.jobs[jobId].dependsOn) {
          if (!seedRunner.jobs[dependency]) {
            throw new Error(
              `Missing dependency ${dependency} for job ${jobId}`,
            );
          }
        }
      }
    }
  }

  return seedRunner;
};
