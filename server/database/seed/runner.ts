import { defineSeedRunner } from "./module/runner";
import skills from "./steps/skills";

export default defineSeedRunner({
  jobs: {
    populateSkills: {
      steps: [skills],
    },
  },
});
