import { defineSeedRunner } from "./module/runner";
import skills from "./steps/skills";
import tests from "./steps/tests";

export default defineSeedRunner({
  jobs: {
    populateSkills: {
      steps: [skills],
    },
  },
  tests: {
    populateTestData: {
      steps: [tests],
    },
  },
});
