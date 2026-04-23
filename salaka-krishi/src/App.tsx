import { ChakraProvider } from "@chakra-ui/react";
import Router from "./router";
import CustomTheme from "./theme/CustomTheme";
import "./theme/global.css";
import Fonts from "./assets/fonts";
import {
    QueryClient,
    QueryClientProvider
} from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import GlobalDataProvider from "./components/GlobalDataProvider";

const queryClient = new QueryClient();

export default function App() {
    return (
        <>
            <ChakraProvider value={CustomTheme}>
                <QueryClientProvider client={queryClient}>
                    <Toaster />
                    <Fonts />

                    <GlobalDataProvider>
                        <Router />
                    </GlobalDataProvider>
                </QueryClientProvider>
            </ChakraProvider>
        </>
    )
}
