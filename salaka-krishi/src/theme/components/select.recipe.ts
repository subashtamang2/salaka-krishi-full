import { defineRecipe } from "@chakra-ui/react";
export const SelectRecipe = defineRecipe({
  variants: {
    variant: {
      primary: {
        field: {
          borderWidth: "1px",
          borderColor: "gray.300",
          borderRadius: "md",
          px: 4,
          h: "48px",
        },
      },

      outline: {
        field: {
          borderWidth: "1px",
          borderColor: "gray.200",
        },
      },

      unstyled: {
        field: {
          border: "none",
          p: 0,
        },
      },
    },
  },
});
