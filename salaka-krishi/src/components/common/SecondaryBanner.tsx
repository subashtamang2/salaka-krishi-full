import { Flex, Heading, Image } from "@chakra-ui/react";
import CustomContainer from "./CustomContainer";
import { BiSolidRightArrow } from "react-icons/bi";
import { useNavigate } from "react-router";
import routes from "@src/router/routes";
interface BannerSectionProps {
    title: string;
    backgroundImage: string;

}
export default function SecondaryBanner({ title, backgroundImage }: BannerSectionProps) {
    const navigate = useNavigate();
    return (
        <Flex
            position={"relative"}
            height={"40vh"} >
            <Flex
                position={"absolute"}
                height={"100%"}
                width={"full"}
                top={0}
                left={0}
                _after={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    w: "100%",
                    h: "100%",
                    bg: "primary.300/70",
                    zIndex: 1,
                }}>
                <Image
                    src={backgroundImage}
                    height={"100%"}
                    width={"100%"}
                    objectPosition={"center"}
                    objectFit={"cover"} />
            </Flex>
            <Flex
                position={"relative"}
                height={"100%"}
                flexDir={"column"}
                width={"100%"}
                zIndex={2}>
                <CustomContainer
                    height={"100%"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    display={"flex"}>
                    <Flex
                        gap={{
                            base: "2",
                            md: "4"
                        }}
                        alignItems={"center"}
                        height={"100%"}
                        justifyContent={"center"}>
                        <Heading onClick={() => navigate(routes.home)}
                            cursor="pointer"
                            textStyle={"secondaryBannerTitle"}
                            as={"h3"}>
                            Home
                        </Heading>
                        <BiSolidRightArrow color="white" />
                        <Heading
                            fontFamily={"primary"}
                            color={"primary.100"}
                            fontSize={{
                                base: "3xl"
                                , md: "5xl"
                            }}
                            fontWeight={700}
                        >
                            {title}
                        </Heading>


                    </Flex>
                </CustomContainer>
            </Flex>
        </Flex>
    );
};
