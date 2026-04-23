import { Flex } from "@chakra-ui/react";
import ContactInfoItem from "./ContactInfoItem.tsx";
import { ContactInfo } from "@src/data/contactInfo.ts";
import { useSiteInfo } from "@src/store/useSiteInfo";

export default function ContactInfoList() {
    const siteInfo = useSiteInfo((state) => state.siteInfo);

    const dynamicContactInfo = ContactInfo.map(item => {
        let dynamicValue = item.link;
        if (siteInfo) {
            if (item.href === "Email") dynamicValue = siteInfo.email || item.link;
            if (item.href === "Phone") dynamicValue = siteInfo.phone || item.link;
        }
        return {
            ...item,
            name: dynamicValue,
            link: dynamicValue
        };
    });

    return (
        <Flex
            direction={"column"}
            gap={4}
            justifyContent={"start"}
            flexWrap={"wrap"}>
            {
                dynamicContactInfo.map(item => <ContactInfoItem key={item.id} contactinfo={item} />)
            }
        </Flex >
    )
}
