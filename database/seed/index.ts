import Seed from "./module";
import { useDB } from "~~/server/utils/database";
import config from "./config";
import runner from "./runner";

const seed = new Seed({
  db: useDB(),
  config,
  runner,
});

seed
  .main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    // eslint-disable-next-line no-console
    console.info("Seed completed!");
    process.exit(0);
  });
