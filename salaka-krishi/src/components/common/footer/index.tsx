import { Flex } from "@chakra-ui/react";
import FooterTop from "./FooterTop";
import FooterBottom from "./FooterBottom";
import CustomContainer from "../CustomContainer";

export default function Footer() {
    return (
        <Flex flexDir={"column"}>
            <FooterTop />
            <CustomContainer bg={"primary.100"}>
                <FooterBottom />
            </CustomContainer>
        </Flex >
    );

}
