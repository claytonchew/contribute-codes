export default defineAppConfig({
  ui: {
    primary: "cyan",
    gray: "neutral",
    notifications: {
      position: "top-0 bottom-auto",
    },
    alert: {
      title: "font-semibold",
      description: "leading-tight dark:font-medium",
      variant: {
        outline:
          "text-{color}-600 dark:text-{color}-400 ring-opacity-50 dark:ring-opacity-50",
        subtle:
          "dark:bg-opacity-5 bg-opacity-20 text-{color}-600 dark:text-{color}-400 ring-opacity-50 dark:ring-opacity-50",
      },
    },
  },
});
