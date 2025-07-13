import type { StylesConfig } from "react-select";

const selectStyles: StylesConfig<{ label: string; value: string }> = {
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

// Create a styles object for React-select components
export const singleSelectStyles: StylesConfig<
  { label: string; value: string },
  false
> = {
  ...selectStyles,

  singleValue: (base) => ({
    ...base,
    color: "var(--color-text-primary)",
  }),
};

// Create a styles object for React-select components
export const multiSelectStyles: StylesConfig<
  { label: string; value: string },
  true
> = {
  ...selectStyles,

  multiValue: (base) => ({
    ...base,
    color: "var(--color-text-secondary)",
    backgroundColor: "var(--color-background-secondary)",
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "var(--color-text-primary)",
    backgroundColor: "var(--color-background-secondary)",
  }),
};
