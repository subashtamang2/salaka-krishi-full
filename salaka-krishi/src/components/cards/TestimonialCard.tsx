import {
    Flex,
    Heading,
    Image,
    Text
} from "@chakra-ui/react";
import type { ClientReviews } from "@src/schema/review";


export default function TestimonialCard({ testimonial }: { testimonial: ClientReviews }) {
    const baseImageURL = import.meta.env.VITE_IMAGE_BASE_URL;
    return (
        <>

            <Flex
                // width={{
                //     base: "100%",
                //     md: "95%",
                //     lg: "90%",
                //     xl: "85%"
                // }}
                gap={10}
                flexDir={"column"}
                justifyContent={"center"}
                alignItems={"center"}>
                <Flex
                    borderWidth={6}
                    borderColor={"primary.100"}
                    borderRadius={"full"}
                    overflow={"hidden"}
                    boxSize={{
                        base: "150px",
                        md: "200px"
                    }}>
                    <Image
                        src={
                            testimonial.imageUrl?.startsWith("http")
                                ? testimonial.imageUrl
                                : testimonial.imageUrl
                                    ? `${baseImageURL}/${testimonial.imageUrl}`
                                    : undefined
                        }
                        alt={testimonial.name}
                        boxSize={"100%"}
                        objectFit={"cover"}

                    />
                </Flex>
                <Flex
                    gap={4}
                    py={2}
                    px={{
                        base: "0",
                        md: "8"
                    }}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDir={"column"}>
                    <Flex
                        flexDir={"column"} >
                        <Heading
                            textAlign={"center"}
                            color={"muted.400"}
                            fontSize={{
                                base: "xl",
                                lg: "2xl"
                            }}
                            fontWeight={"500"}
                            as="h2">{testimonial.name}</Heading>
                        <Text
                            textAlign={"center"}
                            color={"text.200"}
                            fontSize={{
                                base: "xl",
                                lg: "xl"
                            }}
                            fontWeight={"400"}
                            as="h4">{testimonial.position}</Text>
                    </Flex>
                    <Text
                        mb={20}
                        px={4}
                        color={"text.200"}
                        fontFamily={"primary"}
                        fontWeight={"300"}
                        fontSize={"md"}
                        textAlign={"center"}
                        lineHeight={"30px"}>
                        {testimonial.review}
                    </Text>

                </Flex>
            </Flex >
        </>
    )
}
