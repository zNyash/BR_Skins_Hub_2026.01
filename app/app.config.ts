export default defineAppConfig({
  ui: {
    colors: {
      neutral: "zinc",
      primary: "blue",
    },
    button: {
      variants: {
        color: {
          neutral2:
            "bg-muted hover:brightness-110 active:brightness-90 text-toned transition-all duration-100",
        },
      },
    },
    modal: {
      slots: {
        body: "sm:p-3",
        header: "sm:p-3",
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
