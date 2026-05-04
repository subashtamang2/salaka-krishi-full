import {
    Flex,
    Grid,
    GridItem
} from "@chakra-ui/react";
import LargeBlogCard from "@src/components/cards/blog/LargeBlogCard";
import SmallBlogCard from "@src/components/cards/blog/SmallBlogCard";
import DealShowCaseCard from "@src/components/cards/DealShowCaseCard";
import BreadCrumb from "@src/components/common/BreadCrumb";
import CustomContainer from "@src/components/common/CustomContainer";
import CompostInfo from "@src/components/CompostInfo";
import VermicompostSection from "@src/components/VermicompostSection";
import { getBlog } from "@src/api/blog";
import { vermicompostDealShowcaseData } from "@src/data/Vermicompost";
import type { BlogInterface } from "@src/schema/blog";
import { useQuery } from "@tanstack/react-query";
import type { PaginationMeta } from "@src/schema/schema";
import BlogLoading from "../Loadings/BlogLoading";
import NotFoundSm from "../NotFoundSm";


export default function Vermicompost() {
    const { data: blogData, isLoading: isBlogLoading, isError } = useQuery<PaginationMeta<BlogInterface[]>>({
        queryKey: ["vermicompostBlogsAll"],
        queryFn: async () => {
            const res = await getBlog(1, 100);
            return res.data;
        },
    });

    const backendBlogs: BlogInterface[] = blogData?.data?.blogs || [];


    let filteredBlogs = backendBlogs.filter((blog: any) => {
        const category = typeof blog.category === "string" ? blog.category : (blog.category as any)?.slug || (blog.category as any)?.name || "";
        const lowerCategory = category.toLowerCase();


        return lowerCategory === "vermicompost";
    });



    const displayBlogs = filteredBlogs.slice(0, 4);

    return (
        <>

            <CustomContainer
                py={12}>
                <Flex
                    flexDir={"column"}
                    gap={12}>
                    <BreadCrumb />
                    <VermicompostSection />
                    <CompostInfo />
                </Flex>
            </CustomContainer>
            <DealShowCaseCard
                data={vermicompostDealShowcaseData} />
            <CustomContainer
                py={12}>
                {isBlogLoading ? (
                    <BlogLoading count={4} />
                ) : (isError || displayBlogs.length === 0) ? (
                    <NotFoundSm />
                ) : (
                    <Grid
                        justifyContent={{
                            lg: "none",
                            xl: "space-between",
                        }}
                        templateColumns={{
                            base: "100%",
                            md: "100%",
                            lg: "49% 49%",
                            xl: "53% 44%",
                        }}
                        gap={{
                            base: "4",
                            lg: "10",
                            xl: "10",
                        }}>
                        <GridItem>
                            <LargeBlogCard blog={displayBlogs[0]} />
                        </GridItem>

                        <GridItem>
                            <Flex flexDir="column" gap={6}>
                                {displayBlogs.slice(1, 4).map((blog) => (
                                    <SmallBlogCard key={blog.id} blog={blog} />
                                ))}
                            </Flex>
                        </GridItem>
                    </Grid>
                )}
            </CustomContainer>

        </>
    )
}
