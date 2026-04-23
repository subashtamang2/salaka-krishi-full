import { defineRecipe } from "@chakra-ui/react";

export const TextareaRecipe = defineRecipe({
    base: {
        fontWeight: "500",
        fontSize: "lg",
    },
    variants: {
        variant: {
            solid: {
                rounded: "none",
                bg: "primary.100",
                fontSize: {
                    base: "md",
                    xl: "lg",
                },
                _placeholder: {
                    color: "text.900",
                    opacity: 0.7,
                },
            },
            outline: {
                width: "100%",
                borderWidth: 1,
                borderColor: "border.100/30",
                color: "text.400/70",
                fontFamily: "primary",
                fontWeight: "500",
                fontSize: "sm",
                rounded: "none",
                _placeholder: {
                    color: "text.900",
                    opacity: 0.8,
                },
                _focus: {
                    borderColor: "border.100/30",
                },
                _focusVisible: {
                    outline: "none",
                },
            },
            subtle: {
                bg: "transparent",
                borderWidth: 1,
                borderColor: "border.100/30",
                color: "text.400/70",
                rounded: "md",
                fontWeight: "500",
                fontSize: "sm",
                px: 2,
                _placeholder: {
                    color: "text.200",
                },
                _focus: {
                    borderColor: "background.300/70",
                },



            },
        },
    },
});
