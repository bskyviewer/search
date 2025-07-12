import type { StylesConfig } from "react-select";

// Create a styles object for React-select components
export const selectStyles: StylesConfig<
  { label: string; value: string },
  true
> = {
  // Control styles (normal state)
  control: (base, state) => ({
    ...base,
    borderColor: "var(--color-border)",
    boxShadow: "none",
    minHeight: "42px",
    backgroundColor: "var(--color-background)",
    "&:hover": {
      borderColor: "var(--color-primary)",
    },
    ...(state.isFocused && {
      borderColor: "var(--color-primary)",
      boxShadow: "0 0 0 1px var(--color-primary)",
    }),
  }),

  // Menu styles
  menu: (base) => ({
    ...base,
    zIndex: 10,
    backgroundColor: "var(--color-background)",
    color: "var(--color-text-primary)",
    borderColor: "var(--color-border)",
  }),

  // Single value styles
  singleValue: (base) => ({
    ...base,
    color: "var(--color-text-primary)",
  }),

  // Multi value styles
  multiValue: (base) => ({
    ...base,
    color: "var(--color-text-secondary)",
    backgroundColor: "var(--color-background-secondary)",
  }),

  // Multi value styles
  multiValueLabel: (base) => ({
    ...base,
    color: "var(--color-text-primary)",
    backgroundColor: "var(--color-background-secondary)",
  }),

  // Input styles
  input: (base) => ({
    ...base,
    color: "var(--color-text-primary)",
    "& input": {
      color: "var(--color-text-primary)",
    },
  }),

  // Placeholder styles
  placeholder: (base) => ({
    ...base,
    color: "var(--color-text-primary)",
  }),

  // Menu list styles
  menuList: (base) => ({
    ...base,
    "& div": {
      backgroundColor: "var(--color-background)",
      color: "var(--color-text-primary)",
      "&:hover": {
        backgroundColor: "var(--color-background-secondary)",
      },
    },
  }),

  // Option styles
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? "var(--color-background-secondary)"
      : "var(--color-background)",
    color: "var(--color-text-primary)",
    "&:hover": {
      backgroundColor: "var(--color-background-secondary)",
    },
  }),
};
