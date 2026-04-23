import { Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import routes from "@src/router/routes";
import type { BlogInterface } from "@src/schema/blog";
import { useNavigate } from "react-router";
import { getImageSrc } from "@src/utils/image";
export default function SmallBlogCard({ blog }: { blog: BlogInterface }) {
    const router = useNavigate();
    const imageUrl = getImageSrc(blog?.imageUrl);
    console.log("Blog Image URL:", blog?.imageUrl);
    console.log("Full URL:", imageUrl);
    const blogDate = new Date(blog?.createdAt);
    const date = blogDate.getDate();
    const month = blogDate.toLocaleString('default', { month: 'short' });
    const year = blogDate.getFullYear();
    return (
        <Flex
            flexDir={{
                base: "column",
                lg: "column",
                xl: "row",
            }}
            columnGap={{
                md: "2"
            }}
            width="full"
            _hover={{
                shadow: "green.100",
            }}
            transition="all 0.3s ease">
            <Flex

                position="relative"
                width={{
                    base: "100%",
                    lg: "100%",
                    xl: "200px",
                }}

                height={{
                    base: "200px",
                    sm: "300px",
                    md: "140px",
                    lg: "140px",
                    xl: "150px",
                }}
                flexShrink={0}>
                <Image
                    src={imageUrl}
                    alt={blog?.title}
                    width="100%"
                    height="100%"
                    objectFit="cover" />
                <Flex

                    position="absolute"
                    top={2}
                    left={2}
                    alignItems="center"
                    justifyContent="center"
                    borderTopRightRadius="10px"
                    borderBottomLeftRadius="10px"
                    bg="primary.100/80"
                    height="28px"
                    px={2}>
                    <Text
                        fontWeight={400}
                        color="secondary.200"
                        fontSize="xs">
                        {month} {date} {year}
                    </Text>
                </Flex>
            </Flex>

            <Flex
                direction="column"
                gap={2}
                justifyContent={{
                    base: "center",
                    lg: "flex-start"
                }}
                flex="1"
                padding={2}>
                <Heading
                    lineClamp={"1"}
                    color="primary.100"
                    fontSize={{
                        base: "xl",

                    }}>
                    {blog?.title}
                </Heading>
                <Text
                    lineClamp={"2"}
                    color="text.200"
                    fontSize={{
                        base: "sm",
                        md: "sm",

                    }} >
                    {blog?.shortDesc}
                </Text>
                <Button
                    justifyContent={"flex-end"}
                    onClick={() => router(routes.blogDetails.replace(":slug", blog?.slug))}
                    variant="plain">
                    Read More
                </Button>
            </Flex>
        </Flex>
    );
}
