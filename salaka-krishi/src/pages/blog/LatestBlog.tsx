import {
    Grid,
    GridItem
} from "@chakra-ui/react";
import BlogCard from "@src/components/cards/BlogCard";
import { useQuery } from "@tanstack/react-query";
import { getBlog } from "@src/api/blog";
import type { PaginationMeta } from "@src/schema/schema";
import type { BlogInterface } from "@src/schema/blog";
import ProductRow from "../Loadings/ProductRow";

export default function LatestBlog({ currentBlog }: { currentBlog: string }) {
    const { data, isLoading } = useQuery<PaginationMeta<BlogInterface[]>>({
        queryKey: ["latestBlogs"], // Cache key for latest blogs
        queryFn: async () => {
            const res = await getBlog(1, 4); // Fetch 4 to ensure we have 3 after filtering if needed
            return res.data;
        }
    });

    const blogs = data?.data.blogs || [];

    // Filter out the current blog and limit to 3
    const latestBlogs = blogs
        .filter(blog => blog.slug !== currentBlog)
        .slice(0, 3);

    if (isLoading) {
        return <ProductRow noOfRows={{ base: 1, md: 2, lg: 3, xl: 3 }} />;
    }

    return (
        <Grid
            templateColumns={{
                base: "repeat(1,1fr)",
                md: "repeat(2,1fr)",
                lg: "repeat(3,1fr)",
            }}
            gap={{
                base: "8",
                lg: "6",
                xl: "10",
            }}>
            {latestBlogs.map((blog) => (
                <GridItem key={blog.id}>
                    <BlogCard blog={blog} />
                </GridItem>
            ))}
        </Grid>
    );
}
