import { Flex, Heading } from "@chakra-ui/react";
import CustomContainer from "./common/CustomContainer";

interface BannerSectionProps {
    title: string;
    backgroundVideo?: string;
    videoPoster?: string;
}
export default function VideoBanner({
    title,
    backgroundVideo,
    videoPoster,
}: BannerSectionProps) {
    return (
        <Flex
            overflow={"hidden"}
            position="relative"
            flexDir={"column"}
            h="90vh">
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
            <CustomContainer
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                flexDir={"column"}
                position="relative"
                width={"100%"}
                zIndex={2}
                height="100%">
                <Flex
                    px={{
                        base: "2",
                        lg: "6",
                        xl: "4",
                    }}
                    py={{
                        base: 10,
                        md: 24
                    }}
                    w={{
                        base: "100%",
                        lg: "85%",
                        xl: "57%",
                    }}
                    height={"100%"}
                    mx={"auto"}

                    bg="secondary.200/65"
                    borderTopRightRadius={{
                        base: "20px",
                        md: "50px"
                    }}
                    borderBottomLeftRadius={{
                        base: "20px",
                        md: "50px"
                    }}
                    direction="column">
                    <Heading as="h2"
                        textStyle="videoBannerTitle">
                        {title}
                    </Heading>

                </Flex>
            </CustomContainer>
        </Flex>
    );
}
