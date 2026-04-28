import { Flex } from "@chakra-ui/react";
import BreadCrumb from "@src/components/common/BreadCrumb";
import CustomContainer from "@src/components/common/CustomContainer";
import Footer from "@src/components/common/footer";
import Header from "@src/components/common/header";
import AuthModal from "@src/components/common/auth/AuthModal";

import { Outlet } from "react-router";
import useAuth from "@src/hooks/useAuth";

export default function CartLayout() {
    useAuth();
    return (
        <>
            <AuthModal />
            <Header />
            <CustomContainer fontFamily={"primary"}
                mx={{ base: 0, md: "auto" }}
                bg={"background.300/6"} py={10} >
                <Flex flexDir={"column"}  >
                    <BreadCrumb />
                </Flex>

                <Outlet />
            </CustomContainer >
            <Footer />
        </>
    );
}
