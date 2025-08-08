import { migrateToVersion1 } from "./v1";
import { migrateToVersion2 } from "./v2";

// The migrations array, in order of execution.
export const migrations = [migrateToVersion1, migrateToVersion2];

export const LATEST_DATABASE_VERSION = migrations.length;
