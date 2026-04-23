import BlogDetailsBanner from "@src/components/BlogDetailsBanner";
import Content from "@src/components/common/Content";
import CustomContainer from "@src/components/common/CustomContainer";
import { Button, Flex, } from "@chakra-ui/react";
import { useParams } from "react-router";
import LatestBlog from "./LatestBlog";;
import { useQuery } from "@tanstack/react-query";
import { getBlogDetails } from "@src/api/blog";
import ProductRow from "../Loadings/ProductRow";
import NotFound from "../NotFound";
import SEOContent from "@src/components/SEOContent";
import type { DataWrapper } from "@src/schema/schema";
import type { BlogInterface } from "@src/schema/blog";
import { getImageSrc } from "@src/utils/image";

export default function BlogDetails() {
    const { slug } = useParams<{ slug: string }>();

    const { data, isLoading, isError } = useQuery<DataWrapper<BlogInterface>>({
        queryKey: ["blogDetails", slug],
        enabled: !!slug,
        queryFn: async () => {
            const res = await getBlogDetails(slug!);
            return res.data;
        }
    });

    const blog = data?.data;

    const blogDate = new Date(blog?.createdAt!);
    const date = blogDate.getDate();
    const month = blogDate.toLocaleString('default', { month: 'short' });
    const year = blogDate.getFullYear();

    const BannerImageUrl = getImageSrc(blog?.imageUrl);

    if (isLoading) return <ProductRow noOfRows={{
        base: 1,
        md: 1,
        lg: 1,
        xl: 1
    }} />
    if (isError || !blog) return <NotFound title="Blog Not Found"></NotFound>


    return (
        <>
            <SEOContent
                title={blog?.title}
                description={blog?.shortDesc}
                keywords={blog?.keywords}
                image={blog?.imageUrl || ""}
            />
            <BlogDetailsBanner
                title={blog?.title ?? "Loading..."}
                backgroundImage={BannerImageUrl || ""}
                date={` ${month} ${date} ,${year}`}
            />

            <Flex flexDir={"column"}
                bg={"background.300/6"}>
                <CustomContainer py={16}>
                    <Content data={blog?.content ?? ""} />

                    <CustomContainer>
                        <Flex
                            flexDir={"column"}
                            gap={12}
                            alignItems={"start"}>
                            <Button variant={"solid"}
                                _hover={{
                                    bg: "primary.300"
                                }}>
                                Latest News
                            </Button>
                            <LatestBlog currentBlog={blog.slug} />
                        </Flex>
                    </CustomContainer>
                </CustomContainer>
            </Flex>
        </>
    );
}
