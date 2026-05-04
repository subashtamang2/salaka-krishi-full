import { Flex, Grid, GridItem } from "@chakra-ui/react";
import LargeBlogCard from "./cards/blog/LargeBlogCard";
import CustomContainer from "./common/CustomContainer";
import SectionHeading from "./common/SectionHeading";
import SmallBlogCard from "./cards/blog/SmallBlogCard";
import { useQuery } from "@tanstack/react-query";
import { getBlog } from "@src/api/blog";
import ProductRow from "@src/pages/Loadings/ProductRow";
import type { BlogInterface } from "@src/schema/blog";
import type { PaginationMeta } from "@src/schema/schema";
import NotFoundSm from "@src/pages/NotFoundSm";

export default function BlogSection() {
    const { data, isLoading, isError } = useQuery<PaginationMeta<BlogInterface[]>>({
        queryKey: ["blogs"],
        queryFn: async () => {
            const res = await getBlog(1, 4); // fetch 4 latest blogs
            return res.data;
        },
    });

    // Safely get blogs array
    const blogs: BlogInterface[] = data?.data?.blogs || [];
    const largeBlog = blogs[0];
    const smallBlogs = blogs.slice(1, 4); // next 3 blogs

    return (
        <CustomContainer paddingBottom={20}>
            <Flex gap={8} flexDir={"column"}>
                <SectionHeading title="Latest Blogs" />

                {isLoading ? (
                    <ProductRow noOfRows={{ base: 1, md: 2, lg: 2, xl: 2 }} />
                ) : isError || blogs.length === 0 ? (
                    <Flex justify="center" py={10}>
                        <NotFoundSm />
                    </Flex>
                ) : (
                    <Grid
                        justifyContent={{
                            lg: "none",
                            xl: "space-between"
                        }}
                        templateColumns={{
                            base: "100%",
                            md: "100%",
                            lg: "100%",
                            xl: "53% 44%"
                        }}
                        gap={{
                            base: "4",
                            lg: "10",
                            xl: "10"
                        }}
                    >
                        <GridItem>
                            <LargeBlogCard blog={largeBlog} />
                        </GridItem>

                        <GridItem>
                            <Flex
                                flexDir={{
                                    base: "column",
                                    md: "row",
                                    lg: "row",
                                    xl: "column"
                                }} gap="6">
                                {smallBlogs.map((blog) => (
                                    <SmallBlogCard key={blog.id} blog={blog} />
                                ))}
                            </Flex>
                        </GridItem>
                    </Grid>
                )}
            </Flex>
        </CustomContainer>
    );
}
