import {
    Flex,
    Link,
} from "@chakra-ui/react";
import { DEVELOPED_BY, DEVELOPER_WEB_URL } from "@src/utils/constants";
import { useSiteInfo } from "@src/store/useSiteInfo";

export default function FooterBottom() {
    const siteInfo = useSiteInfo((state) => state.siteInfo);
    const currentYear = new Date().getFullYear();

    return (
        <>
            <Flex gap={2}
                flexDir={{
                    base: "column",
                    md: "row"
                }}
                py={4}
                color={"secondary.200/90"}
                fontSize={"sm"}
                justifyContent={{
                    md: "space-between"
                }}
                fontWeight={500}>
                Copyright © {currentYear} {siteInfo?.name || "Salaka"} || All Rights Reserved
                <Flex
                    color={"secondary.200/90"}
                    fontSize={"sm"}
                    fontWeight={500}>
                    Design & Developed By{" "}
                    <Link
                        color={"secondary.200"} href={DEVELOPER_WEB_URL}>{DEVELOPED_BY}</Link></Flex>
            </Flex>
        </>
    )
}
