import type { ResultSet } from "@libsql/client";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { SQLiteTransaction } from "drizzle-orm/sqlite-core";

export interface SeedModule {
  main: () => Promise<void>;
}

export interface SeedStep {
  name?: string;
  seed: (
    tx: SQLiteTransaction<
      "async",
      ResultSet,
      Record<string, never>,
      ExtractTablesWithRelations<Record<string, never>>
    >,
  ) => Promise<void> | void;
  continueOnError?: boolean;
}

export type SeedRunner = {
  versions?: Record<number, SeedStep[]>;
  jobs?: Record<
    string,
    {
      steps: SeedStep[];
      dependsOn?: string[];
      continueOnError?: boolean;
    }
  >;
  tests?: Record<
    string,
    {
      steps: SeedStep[];
      dependsOn?: (typeof testId)[];
      continueOnError?: boolean;
    }
  >;
};

export type SeedConfig = {
  includeTest?: boolean;
  resetVersion?: number;
};
