import { Box, Container, type HTMLChakraProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface Props extends HTMLChakraProps<"div"> {
    children: ReactNode;
}
export default function CustomContainer(props: Props) {
    const { children, ...rest } = props;
    return (
        <Box {...rest}>
            <Container maxW={{
                base: "100%",
                sm: "container.sm",
                md: "container.md",
                lg: "container.md",
                xl: "container.lg",
                "2xl": "container.xl",
            }} px={{ base: 3, md: 6 }} > {children} </Container>
        </Box>
    );
}
