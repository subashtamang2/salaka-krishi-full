import {
    Link,
    Flex
} from "@chakra-ui/react";
import type { SocialMediaList } from "@src/schema/schema";
interface Props {
    contactinfo: SocialMediaList;
    type?: "sec" | null;
}
export default function ContactInfoItem({ contactinfo, type }: Props) {
    const Icon = contactinfo.icon;
    const href = contactinfo.href === "Email" ? `mailto:${contactinfo.link}` : contactinfo.href === "Phone" ? `tel:${contactinfo.link}` : contactinfo.link
    return (
        <Link
            href={href}
            _hover={{
                textDecoration: "none"
            }}
            py={type === "sec" ? 4 : 0}
            borderColor={type === "sec" ? "white" : "transparent"}
            borderBottomWidth={type === "sec" ? 2 : 0}>
            <Flex
                alignItems={"center"}
                gap={3}
                color={type === "sec" ? "white" : "muted.600"}>
                <Flex
                    fontSize="xl">
                    <Icon />
                </Flex>
                <Flex>{contactinfo.name}</Flex>
            </Flex>
        </Link>
    );
}
