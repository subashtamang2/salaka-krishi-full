import {
    Flex,
    Skeleton,
    Stack,
} from "@chakra-ui/react";
import CustomContainer from "@src/components/common/CustomContainer";

export default function HeroBannerLoading() {
    return (
        <Flex
            flexDir={"column"}
            position="relative"
            width="full"
            h={{
                base: "60vh",
                md: "65vh",
            }}
            overflow="hidden" >

            <Skeleton
                width="100%"
                height="100%"
                position="absolute"
                top={0}
                left={0} />

            <Flex
                zIndex={2}
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                justify="center"
                align="center" >
                <CustomContainer
                    width={"100%"}>
                    <Flex
                        width={{
                            base: "100%",
                            xl: "80%"
                        }}
                        mx={"auto"}
                        flexDir="column"
                        bg="whiteAlpha.600"
                        backdropFilter="blur(8px)"
                        justifyContent={"center"}
                        alignItems={"center"}


                        gap={6}
                        py={12}
                        px={6}>
                        <Stack
                            gap={4}
                            align="center"
                            width="100%">
                            <Skeleton
                                height="20px"
                                width="150px"
                                borderRadius="md" />


                            <Stack
                                gap={4}
                                align="center"
                                width="100%">
                                <Skeleton
                                    height="40px"
                                    width={{
                                        base:
                                            "80%",
                                        md: "60%"
                                    }}
                                    borderRadius="md" />
                                <Skeleton
                                    height="40px"
                                    width={{
                                        base: "60%",
                                        md: "40%"
                                    }}
                                    borderRadius="md" />
                            </Stack>


                            <Skeleton
                                height="48px"
                                width="140px"
                                borderRadius="full"
                                mt={4} />
                        </Stack>
                    </Flex>
                </CustomContainer>
            </Flex>
        </Flex>
    );
}
