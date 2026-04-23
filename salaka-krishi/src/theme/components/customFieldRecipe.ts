import { defineSlotRecipe } from "@chakra-ui/react"

export const fieldRecipe = defineSlotRecipe({
    slots: ["label", "errorText", "helperText", "requiredIndicator"],
    base: {
        label: {
            color: "primary.300",
            fontFamily: "primary",
            fontWeight: 400,
            fontSize: "sm",
            mb: 2,
        },
        errorText: {
            fontFamily: "primary",
            color: "status.300",
            fontSize: "sm",
            mt: 1,
        },
        helperText: {
            fontFamily: "primary",
            color: "text.200",
            fontSize: "sm",
            mt: 1,
        },
        requiredIndicator: {
            fontFamily: "primary",
            color: "status.300",
        },
    },
})
