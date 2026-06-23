import { Flex } from "@chakra-ui/react";

interface BannerSectionProps {
    title?: string;
    backgroundVideo?: string;
    videoPoster?: string;
}
export default function VideoBannerSecondary({
    backgroundVideo,
    videoPoster,
}: BannerSectionProps) {
    return (
        <Flex
            overflow={"hidden"}
            position="relative"
            flexDir={"column"}
            h={{
                base: "30vh",
                md: "40vh",
                lg: "45vh"
            }}>
            <Flex
                position="absolute"
                height={"100%"}
                width={"100%"}
                top={0}
                left={0}>
                <video
                    poster={videoPoster}
                    autoPlay
                    muted
                    loop>
                    <source src={backgroundVideo} type="video/mp4" />
                </video>
            </Flex>
        </Flex>
    );
}
