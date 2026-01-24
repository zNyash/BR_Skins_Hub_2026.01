export default defineAppConfig({
  ui: {
    colors: {
      neutral: "zinc",
      primary: "blue",
    },
    modal: {
      slots: {
        body: "sm:p-3",
      },
      variants: {
        fullscreen: {
          false: {
            content: "max-w-xs",
          },
        },
      },
    },
  },
});
