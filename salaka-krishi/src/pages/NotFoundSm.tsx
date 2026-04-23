import { Flex, Image } from "@chakra-ui/react";
import CustomContainer from "@src/components/common/CustomContainer";
import NotFoundIllustration from "@assets/images/maintainace/404.svg";

export default function NotFoundSm() {
    return (
        <>
            <CustomContainer>
                <Flex
                    height={"50vh"}
                    flexDir={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={4}>
                    <Flex
                        flexDir={"column"}
                        gap={{
                            base: "20",
                            md: "24",
                            lg: "24",
                        }} >
                        <Flex
                            height={{
                                base: "200px",
                                md: "250px",
                                lg: "300px"
                            }}
                            width={{
                                base: "300px",
                                md: "400px",
                                lg: "500px",

                            }}>
                            <Image src={NotFoundIllustration}
                                alt={"svg iamges"}
                                height={"100%"}
                                width={"100%"}
                                objectFit={"cover"}
                                objectPosition={"bottom"}
                            />
                        </Flex>
                    </Flex>
                </Flex>

            </CustomContainer>
        </>
    )
}
