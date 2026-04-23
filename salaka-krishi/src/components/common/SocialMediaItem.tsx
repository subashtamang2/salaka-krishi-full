import { Link } from "@chakra-ui/react";
import type { SocialMediaList } from "@src/schema/schema";


interface Props {
    socialmedia: SocialMediaList;
}

export default function SocialMediaItem({ socialmedia }: Props) {
    const Icon = socialmedia.icon;
    return (
        <Link href={socialmedia.link}
            fontSize={"xl"}
            outlineColor={"main.400"}
            color={"primary.100"}
            target="_blank"
            _focus={{
                outline: "none"
            }}
            _hover={{
                outlineColor: "primary.400",
                color: "primary.400",
                animation: "all 0.3s ease-in-out",
            }}> <Icon /></Link >
    )
}
