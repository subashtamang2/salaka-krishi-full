import { defineRecipe } from "@chakra-ui/react";

export const InputRecipe = defineRecipe({
    base: {
        fontFamily: "primary",
        fontWeight: "700",
    },
    variants: {
        variant: {
            flushed: {
                bg: "transparent",
                border: "none",
                color: "secondary.200",
                rounded: "none",
                fontWeight: "500",
                fontSize: "md",
                px: 2,
                _placeholder: {
                    color: "secondary.200/80",
                },
                _focus: {
                    borderColor: "primary.300",
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
            outline: {

                bg: "transparent",
                borderWidth: 1,
                borderColor: "border.100/30",
                color: "text.400/70",
                fontWeight: "500",
                fontSize: "sm",
                rounded: "none",
                px: 2,
                _placeholder: {
                    color: "text.200",
                },
                _focus: {
                    borderColor: "border.100/30",
                },
                _focusVisible: {
                    outline: "none",
                },

            }


        },
    },
});
