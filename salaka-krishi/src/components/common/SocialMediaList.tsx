import { Flex } from "@chakra-ui/react";
import SocialMediaItem from "./SocialMediaItem";
import { SocialMedia } from "@src/data/SocialMedia";
import { useSiteInfo } from "@src/store/useSiteInfo";

export default function SocialMediaList() {
    const siteInfo = useSiteInfo((state) => state.siteInfo);
    
    // Combine hardcoded icons with dynamic links
    const dynamicSocialMedia = SocialMedia.map(item => {
        let dynamicLink = item.link;
        if (siteInfo?.socialMediaLinks) {
            const smLinks = siteInfo.socialMediaLinks;
            if (item.name === "Facebook") dynamicLink = smLinks.facebook || item.link;
            if (item.name === "Twitter") dynamicLink = smLinks.twitter || item.link;
            if (item.name === "Pinterest") dynamicLink = smLinks.pinterest || item.link;
            if (item.name === "Youtube") dynamicLink = smLinks.youtube || item.link;
        }
        return { ...item, link: dynamicLink };
    });

    return (
        <Flex gap={4}
            justifyContent={"start"}
            alignItems={"center"}
            flexWrap={"wrap"}>
            {
                dynamicSocialMedia.filter(item => item.name !== "Pinterest").map(item => (
                    <SocialMediaItem key={item.id} socialmedia={item} />
                ))
            }
        </Flex >
    )
}
