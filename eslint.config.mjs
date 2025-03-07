// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    "no-console": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "vue/multi-word-component-names": "off",
  },
});
