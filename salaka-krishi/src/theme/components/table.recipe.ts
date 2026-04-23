import { defineSlotRecipe } from "@chakra-ui/react";

export const tableRecipe = defineSlotRecipe({
  className: "chakra-table",
  slots: [
    "root",
    "header",
    "body",
    "row",
    "columnHeader",
    "cell",
    "footer",
    "caption",
  ],

  variants: {
    variant: {
      clean: {
        root: {
          border: "none",
          borderCollapse: "collapse",
        },

        header: {
          bg: "primary.100/5",
          boxShadow: "greenSoft.100",
          borderBottom: "none",
        },

        columnHeader: {
          color: "primary.300",
          borderBottom: "none",
          py: 6,
          fontSize: {
            base: "xl",
            md: "2xl",
          },
          fontWeight: 700,
          _first: { pl: 0 },
          _last: { pr: 0 },
        },

        row: {
          borderBottom: "none",
        },

        cell: {
          borderBottom: "none",
          fontSize: {
            base: "xl",
            md: "2xl",
          },
          fontWeight: 400,
          _first: { pl: 0 },
          _last: { pr: 0 },
        },
      },
    },
  },
});
