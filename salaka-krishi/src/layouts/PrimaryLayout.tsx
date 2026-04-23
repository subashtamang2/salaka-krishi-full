import { Flex } from "@chakra-ui/react";
import Footer from "@src/components/common/footer";
import Header from "@src/components/common/header";
import useAuth from "@src/hooks/useAuth";
import AuthModal from "@src/components/common/auth/AuthModal";

import { Outlet } from "react-router";

export default function PrimaryLayout() {
    useAuth();
    return (
        <>
            <AuthModal />
            <Flex
                flexDir={"column"} fontFamily={"primary"}>
                <Header />
                <Flex
                    bg={"background.300/5"}
                    flexDirection={"column"}>
                    <Outlet />
                </Flex>
                <Footer />
            </Flex>
        </>
    )
}
