import { Box, Flex, IconButton } from "@chakra-ui/react";
import routes from "@src/router/routes";
import { TbArrowBackUp } from "react-icons/tb";
import { Outlet, useNavigate } from "react-router";
import AuthModal from "@src/components/common/auth/AuthModal";

export default function AuthLayout() {
    const navigate = useNavigate();
    return (
        <Box
            width={"full"}
            px={5}
            py={5}
            minH={"100vh"}
            display="flex"
            flexDirection="column"
            fontFamily="poppins"
            bg={"background.300/6"}
            minBlockSize={"100vh"}>
            <AuthModal />
            <Flex
                justifyContent={"flex-end"}>

                <IconButton
                    borderRadius={"5px"}
                    width={{
                        base: "40px",
                        md: "45px",
                        lg: "50px",
                        xl: "60px"
                    }}
                    height={{
                        base: "40px",
                        md: "45px",
                        lg: "50px",
                        xl: "60px"
                    }}
                    bg={"background.600"}
                    aria-label="Back"
                    borderWidth={1}
                    color={"primary.100/20"}
                    borderColor={"border.400"}

                    onClick={() => navigate(routes.home)} >
                    <TbArrowBackUp />
                </IconButton>

            </Flex>

            <Flex
                height={"full"}
                flex={1}
                flexDir={"column"}
                justifyContent={"center"}
                alignItems="center">
                <Outlet />
            </Flex>
        </Box >
    );
}
