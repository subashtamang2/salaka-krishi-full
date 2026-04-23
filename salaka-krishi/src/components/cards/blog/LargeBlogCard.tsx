import {
    Flex,
    Heading,
    Image,
    Link,
    Text
} from "@chakra-ui/react";
import { getBlog } from "@src/api/blog";
import ProductRow from "@src/pages/Loadings/ProductRow";
import routes from "@src/router/routes";
import type { BlogInterface } from "@src/schema/blog";
import type { PaginationMeta } from "@src/schema/schema";
import { getImageSrc } from "@src/utils/image";

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";


export default function LargeBlogCard({ currentBlog, blog: passedBlog }: { currentBlog?: string, blog?: BlogInterface }) {
    const router = useNavigate();
    const { data, isLoading, isError } = useQuery<PaginationMeta<BlogInterface[]>>({
        queryKey: ["latestBlogs"],
        queryFn: async () => {
            const res = await getBlog(1, 4);
            return res.data;
        },
    });
    const blogs: BlogInterface[] = data?.data?.blogs || [];


    const latestBlogs = blogs
        .filter((blog) => blog.slug !== currentBlog)
        .slice(0, 3);

    if (isLoading) {
        return <ProductRow noOfRows={{ base: 1, md: 2, lg: 3, xl: 3 }} />;
    }
    if (isError || latestBlogs.length === 0) {
        return <div>No latest blogs found.</div>;
    }

    const blog = passedBlog || latestBlogs[0];
    if (!blog) {
        return <div>No blog found.</div>;
    }
    const blogDate = new Date(blog.createdAt);
    const date = blogDate.getDate();
    const month = blogDate.toLocaleString("default", { month: "short" });
    const year = blogDate.getFullYear();

    const imageUrl = getImageSrc(blog.imageUrl);




    return (
        <>
            <Flex

                flexDir={"column"}
                _hover={{
                    shadow: "green.100",

                }}
                gap={{
                    base: "8",
                    md: "4",
                }}
                overflow={"hidden"}
                cursor="pointer"
                transition="all 0.5s ease"
                width={{
                    base: "100%",
                    md: "full",
                    lg: "full",
                }}>
                <Flex
                    position={"relative"}
                    height={{
                        base: "100%",
                        md: "400px",
                        lg: "324px",
                    }}
                    width={{
                        base: "100%",
                        md: "full",
                        lg: "full",
                    }}>
                    <Image
                        borderBottomLeftRadius={{
                            base: "0",
                            md: "60px"
                        }}
                        src={imageUrl}
                        alt={blog.title}
                        height="100%"
                        width="100%"
                        objectFit={"cover"} />
                    <Flex
                        position="absolute"
                        top={2}
                        left={2}
                        alignItems="center"
                        justifyContent="center"
                        borderTopRightRadius="10px"
                        borderBottomLeftRadius="10px"
                        bg="primary.100/80"
                        height="32px"
                        px={8}>
                        <Text
                            as={"div"}
                            fontWeight={400}
                            color="secondary.200"
                            fontSize="xs">
                            {month} {date}, {year}
                        </Text>
                    </Flex>
                </Flex>

                <Flex
                    justifyContent={"space-between"}
                    flexDir={"column"}
                    gap={4}
                    px={{
                        base: "0",
                        md: "6"
                    }}
                    pb={"4"}
                >
                    <Heading
                        lineClamp={1}
                        color={"primary.100"}
                        fontSize={"2xl"}>
                        {blog.title}
                    </Heading>
                    <Text
                        lineClamp={3}
                        color={"text.200"}
                        fontSize={"sm"}>
                        {blog.shortDesc}
                    </Text>

                    <Link
                        onClick={() => router(routes.blogDetails.replace(":slug", blog.slug))}
                        textDecoration={"none"}
                        color={"primary.100"}
                        alignSelf="flex-end" >
                        Read More
                    </Link>
                </Flex>
            </Flex>




        </>
    )
}
