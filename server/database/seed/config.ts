import { defineSeedConfig } from "./module/config";

export default defineSeedConfig({
  includeTest: process.env.SEED_TEST_DATA === "true",
  resetVersion: process.env.SEED_RESET_VERSION
    ? parseInt(process.env.SEED_RESET_VERSION || "0", 10)
    : undefined,
});
