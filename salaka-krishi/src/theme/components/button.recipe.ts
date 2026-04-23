import { defineRecipe } from "@chakra-ui/react";
export const buttonRecipe = defineRecipe({
    base: {
        fontWeight: "500",
        fontSize: "lg",
    },
    variants: {
        variant: {
            // "solid" | "subtle" | "surface" | "outline" | "ghost" | "plain"
            solid: {
                rounded: "none",
                bg: "primary.100",
                fontSize: {
                    base: "md",
                    xl: "lg",
                },

            },
            subtle: {
                bg: "primary.300",
                color: "white",
                padding: {
                    base: 4,
                    md: 10,
                    lg: 20,
                    xl: "32",
                },
                fontSize: {
                    base: "md",
                    md: "2xl",
                    lg: "5xl",
                    xl: "8xl",
                },
            },

            plain: {
                fontWeight: 300,
                borderRadius: "0",
                color: "primary.100",
                px: 0,
                py: 0,
            },

            outline: {
                borderWidth: 2,
                fontSize: { base: "sm", md: "lg" },
                fontWeight: 400,
                borderRadius: "0",
                color: "primary.300",
                borderColor: "primary.100",
                px: 6,
                py: 6,
                _hover: {
                    bgColor: "primary.300",
                    color: "secondary.200",
                    borderColor: "transparent",

                }
            },
            ghost: {
                fontWeight: 300,
                borderRadius: "0",
                color: "muted.700",
                px: 0,
                py: 0,
                _hover: {
                    bg: "none"
                }
            },


        },
        colorScheme: {
            green: {
                bg: "primary.100",
                color: "secondary.200",
            },
            white: {
                bg: "secondary.200",
                color: "primary.100",
            },
        },
        size: {
            lg: {
                py: 6,
                px: 14,
            },
            md: {
                py: 6,
                px: {
                    base: "10",
                    sm: "24",
                    md: "14",
                },
                width: {
                    base: "100%",
                    sm: "50%",
                    md: "auto",
                },
            },
            sm: {
                py: 5,
                px: 5,
            },
        },
    },
});
