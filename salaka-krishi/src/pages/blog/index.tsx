import SecondaryBanner from "@src/components/common/SecondaryBanner";
import bgimage from "@assets/images/blog/banner.png";
import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import CustomContainer from "@src/components/common/CustomContainer";
import SectionHeading from "@src/components/common/SectionHeading";
import Gallery from "@src/components/Gallery";
import BlogCard from "@src/components/cards/BlogCard";
import useIsVisible from "@src/utils/useIsVisible";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBlog } from "@src/api/blog";
import BlogLoading from "../Loadings/BlogLoading";
import NotFoundSm from "../NotFoundSm";
import type { PaginationMeta } from "@src/schema/schema";
import type { BlogInterface } from "@src/schema/blog";
export default function Blog() {
    const { ref, isVisible } = useIsVisible<HTMLDivElement>();
    const [page] = useState<number>(1);
    const [limit,] = useState<number>(6);


    const { data, isLoading, isError } = useQuery<PaginationMeta<BlogInterface[]>>({
        queryKey: ["blog", page, limit],
        enabled: !!isVisible,
        queryFn: async () => {
            const res = await getBlog(page, limit);
            return res.data;
        }
    });

    const blogs = data?.data?.blogs || [];
    return (
        <>
            <SecondaryBanner
                backgroundImage={bgimage}
                title="Blog" />
            <CustomContainer
                py={8}>
                <Flex
                    flexDir={"column"}
                    gap={20}
                    ref={ref}
                >
                    <Flex flexDir={"column"}>
                        <SectionHeading
                            title="Our Blogs" />
                        <Text
                            textAlign={"center"}
                            textStyle={"desc"}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Bibendum est ultricies integer quis. Iaculis urna id volutpat lacus laoreet. Mauris vitae ultricies leo integer malesuada.magna aliqua. Bibendum est ultricies integer quis. Iaculis urna id volutpat lacus laoreet. Mauris vitae ultricies leo integer malesuada </Text>
                    </Flex>

                    <Grid templateColumns={{
                        base: "repeat(1,1fr)",
                        md: "repeat(2,1fr)",
                        lg: "repeat(3,1fr)",
                    }}
                        gap={{
                            base: "8",
                            lg: "6",
                            xl: "10",
                        }}>

                        {
                            blogs.map((blog) => (
                                <GridItem key={blog.id}>
                                    <BlogCard blog={blog} />

                                </GridItem>
                            ))}
                    </Grid>
                    {
                        isLoading && <BlogLoading count={limit} />
                    }
                    {
                        isError && <NotFoundSm />
                    }

                </Flex>
            </CustomContainer>
            <CustomContainer py={8}>
                <Gallery />
            </CustomContainer>


        </>
    );
}
