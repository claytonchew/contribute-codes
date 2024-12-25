import skills from "~~/database/seed/data/skills.json";

export default defineEventHandler(async () => {
  // To save on database queries, we can host the skills in json file and read from it instead
  return skills.map((skill) => skill.name);
});
