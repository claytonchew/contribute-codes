import { sql } from "drizzle-orm";
import type { ResultSet } from "@libsql/client";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import type { SeedConfig, SeedModule, SeedRunner, SeedStep } from "./Seed";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

class Seed implements SeedModule {
  private seedConfig: SeedConfig;
  private seedRunner: SeedRunner;
  private jobLogs: Record<string, boolean> = {};
  private testLogs: Record<string, boolean> = {};
  private db: LibSQLDatabase<Record<string, never>>;

  constructor({
    config,
    runner,
    db,
  }: {
    config: SeedConfig;
    runner: SeedRunner;
    db: LibSQLDatabase<Record<string, never>>;
  }) {
    this.seedConfig = config;
    this.seedRunner = runner;
    this.db = db;
  }

  private async runSteps(
    tx: SQLiteTransaction<
      "async",
      ResultSet,
      Record<string, never>,
      ExtractTablesWithRelations<Record<string, never>>
    >,
    steps: SeedStep[],
  ) {
    for (const step of steps) {
      try {
        await step.seed(tx);
      } catch (error) {
        if (!step.continueOnError) {
          throw error;
        }
        // eslint-disable-next-line no-console
        console.error(
          `Error in step${step?.name ? " " + step.name : ""}:`,
          error,
        );
        // eslint-disable-next-line no-console
        console.error("Ignoring error and continuing...");
      }
    }
  }

  private async runVersion(
    tx: SQLiteTransaction<
      "async",
      ResultSet,
      Record<string, never>,
      ExtractTablesWithRelations<Record<string, never>>
    >,
    version: number,
  ) {
    if (this.seedRunner?.versions && this.seedRunner.versions[version]) {
      await this.runSteps(tx, this.seedRunner.versions[version]);
    }
  }

  private async runJob(
    tx: SQLiteTransaction<
      "async",
      ResultSet,
      Record<string, never>,
      ExtractTablesWithRelations<Record<string, never>>
    >,
    jobId: string,
    continueOnError?: boolean,
  ) {
    if (this.jobLogs[jobId]) {
      return;
    }

    // eslint-disable-next-line no-console
    console.info(`Running job: ${jobId}`);

    const job = this.seedRunner!.jobs![jobId];

    if (job!.dependsOn) {
      for (const dependency of job!.dependsOn) {
        const dependedJob = this.seedRunner.jobs![dependency];
        try {
          await this.runJob(tx, dependency, job!.continueOnError);
        } catch (error) {
          if (
            !dependedJob!.continueOnError &&
            !job!.continueOnError &&
            !continueOnError
          ) {
            throw error;
          }
          // eslint-disable-next-line no-console
          console.error(`Error in job ${dependency}:`, error);
          // eslint-disable-next-line no-console
          console.error("Ignoring error and continuing...");
        }
      }
    }

    try {
      await this.runSteps(tx, job!.steps);
    } catch (error) {
      if (!job!.continueOnError) {
        throw error;
      }
      // eslint-disable-next-line no-console
      console.error(`Error in job ${jobId}:`, error);
      // eslint-disable-next-line no-console
      console.error("Ignoring error and continuing...");
    } finally {
      this.jobLogs[jobId] = true;
    }
  }

  private async runTest(
    tx: SQLiteTransaction<
      "async",
      ResultSet,
      Record<string, never>,
      ExtractTablesWithRelations<Record<string, never>>
    >,
    testId: string,
    continueOnError?: boolean,
  ) {
    if (this.testLogs[testId]) {
      return;
    }

    // eslint-disable-next-line no-console
    console.info(`Running test: ${testId}`);

    const test = this.seedRunner!.tests![testId];

    if (test!.dependsOn) {
      for (const dependency of test!.dependsOn) {
        const dependedTest = this.seedRunner.tests![dependency];
        try {
          await this.runTest(tx, dependency, test!.continueOnError);
        } catch (error) {
          if (
            !dependedTest!.continueOnError &&
            !test!.continueOnError &&
            !continueOnError
          ) {
            throw error;
          }
          // eslint-disable-next-line no-console
          console.error(`Error in test ${dependency}:`, error);
          // eslint-disable-next-line no-console
          console.error("Ignoring error and continuing...");
        }
      }
    }

    try {
      await this.runSteps(tx, test!.steps);
    } catch (error) {
      if (!test!.continueOnError) {
        throw error;
      }
      // eslint-disable-next-line no-console
      console.error(`Error in test ${testId}:`, error);
      // eslint-disable-next-line no-console
      console.error("Ignoring error and continuing...");
    } finally {
      this.testLogs[testId] = true;
    }
  }

  async main() {
    await this.db.transaction(async (tx) => {
      let { user_version: databaseVersion } = await tx.get<{
        user_version: number | null;
      }>(sql`PRAGMA user_version`);

      databaseVersion = databaseVersion || 0;
      // eslint-disable-next-line no-console
      console.info("Current database version:", databaseVersion);

      if (this.seedConfig.resetVersion !== undefined) {
        await tx.run(
          sql.raw(`PRAGMA user_version = ${this.seedConfig.resetVersion}`),
        );
        databaseVersion = this.seedConfig.resetVersion;
        // eslint-disable-next-line no-console
        console.info("Reset database version to:", databaseVersion);
      }

      if (
        this.seedRunner.versions &&
        Object.keys(this.seedRunner.versions).length
      ) {
        const sortedVersions = Object.keys(this.seedRunner.versions)
          .map(Number)
          .sort();

        for (const version of sortedVersions) {
          if (databaseVersion <= version) {
            // eslint-disable-next-line no-console
            console.info("Running seed version", version);
            await this.runVersion(tx, version).then(async () => {
              await tx.run(sql.raw(`PRAGMA user_version = ${version}`));
              databaseVersion = version;
            });
          }
        }
      }

      if (this.seedRunner.jobs) {
        for (const jobId in this.seedRunner.jobs) {
          await this.runJob(
            tx,
            jobId,
            this.seedRunner.jobs?.[jobId]?.continueOnError,
          );
        }
      }

      if (this.seedRunner.tests && this.seedConfig.includeTest) {
        for (const testId in this.seedRunner.tests) {
          await this.runTest(
            tx,
            testId,
            this.seedRunner.tests?.[testId]?.continueOnError,
          );
        }
      }
    });
  }
}

export default Seed;
