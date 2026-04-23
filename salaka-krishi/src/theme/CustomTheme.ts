import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { buttonRecipe } from "./components/button.recipe";
import { textStyles } from "./components/text.recipe";
import { InputRecipe } from "./components/input.recipe";
import { fieldRecipe } from "./components/customFieldRecipe";
import { TextareaRecipe } from "./components/textArea.recipe";
import { tableRecipe } from "./components/table.recipe";
const config = defineConfig({
    theme: {
        breakpoints: {
            xs: "23.4375em", // 375px
            sm: "30em", // 480px
            md: "48em", // 768px
            lg: "62em", // 992px
            xl: "80em", // 1280px
            "2xl": "96em", // 1536px
            xxl: "120em", // 1920px,
        },
        tokens: {
            colors: {
                primary: {
                    100: { value: "#1FA862" },
                    200: { value: "#BFBFBF" },
                    300: { value: "#00432C" },
                    400: { value: "#5B665A" },
                    500: { value: "#0d4a28" },
                },
                secondary: {
                    100: { value: "#000000" },
                    200: { value: "#FFFFFF" },
                    250: { value: "#F5F5F5" },
                    300: { value: "#EAEBE5" },
                    400: { value: "#F2F2F2" },
                    500: { value: "#C8B69C" },
                },
                status: {
                    100: { value: "#28A745" },
                    200: { value: "#F4813E" },
                    300: { value: "#D92D20" },
                },
                text: {
                    100: { value: "#B7B7B7" },
                    200: { value: "#A1A1A1" },
                    300: { value: "#313131" },
                    400: { value: "#3E3E3E" },
                    500: { value: "#373636" },
                    600: { value: "#2D2E2F" },
                    700: { value: "#C0C0C0" },
                    800: { value: "#443F3F" },
                    900: { value: "#787878" },
                    1000: { value: "#82A895" },
                    1100: { value: "#363636" },


                },

                muted: {
                    100: { value: "#231F20" },
                    200: { value: "#707070" },
                    300: { value: "#FFA500" },
                    400: { value: "#1D1D1D" },
                    500: { value: "#f56565" },
                    600: { value: "#606060" },
                    700: { value: "#5C5C5C" },
                    800: { value: "#B3B3B3" },
                    900: { value: "#2D2E2F" },
                    1000: { value: "#E53935" },
                },
                background: {
                    100: { value: "#CCBAA9" },
                    200: { value: "#C9B79D" },
                    300: { value: "#1EA862" },
                    400: { value: "#F6F6F6" },
                    500: { value: "#E53935" },
                    600: { value: "#F0F9FF" },
                },
                border: {
                    100: { value: "#707070" },
                    200: { value: "#8B8E8E80" },
                    300: { value: "#434343" },
                    400: { value: "#E1E4EB" },

                }

            },
            shadows: {
                green: {
                    100: { value: "0px 5px 10px rgba(73, 160, 16, 0.10)" },
                    150: { value: "0px 5px 10px rgba(73, 160, 16, 0.01)" },
                },
                greenSoft: {
                    100: { value: "0px 2px 5px rgba(30, 168, 98, 0.08)" },
                },
                // greenVerySfot:{
                //     100:{ value: "0px 2px 5px rgba(30, 168, 98, 0.08)" },
                // },
                black: {
                    100: { value: "0px 3px 6px rgba(0,0,0,0.16)" },
                },
            },

            fonts: {
                primary: { value: "Montserrat" },
                secondary: { value: "RobotoSlab" },
                poppins: { value: "Poppins" },
            },
            sizes: {
                container: {
                    xs: { value: "425px" },
                    sm: { value: "640px" },
                    md: { value: "768px" },
                    lg: { value: "1024px" },
                    xl: { value: "1280px" },
                    xxl: { value: "1444px" },
                    "2xl": { value: "1536px" },
                },
            },
        },
        recipes: {
            button: buttonRecipe,
            input: InputRecipe,
            textarea: TextareaRecipe,
        },
        slotRecipes: {
            field: fieldRecipe,
            table: tableRecipe,
        },
        textStyles: textStyles,
    },
});

const CustomTheme = createSystem(defaultConfig, config);
export default CustomTheme;
