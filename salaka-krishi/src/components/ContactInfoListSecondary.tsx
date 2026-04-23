import { Flex } from "@chakra-ui/react";

import ContactInfoItem from "./ContactInfoItem.tsx";
import { ContactInfo } from "@src/data/contactInfo.ts";

export default function ContactInfoListSecondary() {
    return (
        <Flex
            direction={"column"}
            gap={2}
            justifyContent={"start"}
            flexWrap={"wrap"}>
            {
                ContactInfo.map(item => <ContactInfoItem key={item.id} contactinfo={item} />)
            }
        </Flex >
    )
}
