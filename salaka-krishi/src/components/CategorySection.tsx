import { Flex, Spinner, Text } from "@chakra-ui/react";
import CategoryCard from "./cards/CategoryCard";
import CustomContainer from "./common/CustomContainer";
import SectionHeading from "./common/SectionHeading";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@src/api/categories";
import type { CategorySchema } from "@src/schema/categories";
import type { DataWrapper } from "@src/schema/schema";


export default function CategorySection() {
    const { data, isLoading, isError } = useQuery<DataWrapper<CategorySchema[]>>({
        queryKey: ["categories"],
        queryFn: () => getCategories().then(res => res.data),
    });
    const categories = data?.data || [];

    return (
        <CustomContainer
            pt={"10"}
            pb={"16"}
            bg={"primary.100/11"}>
            <Flex
                gap={"6"}
                flexDir={"column"}>
                <SectionHeading
                    title="Top Categories" />

                <Flex
                    flexWrap={"wrap"}
                    justifyContent={"Center"}
                    gap={{
                        base: "8",
                    }}>
                    {isLoading ? (
                        <Flex justify="center" align="center" w="full" py={10}>
                            <Spinner color="primary.100" />
                        </Flex>
                    ) : isError ? (
                        <Text color="red.500">Failed to load categories. Please try again later.</Text>
                    ) : categories.length > 0 ? (
                        categories.slice(0, 5).map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category} />
                        ))
                    ) : (
                        <Flex flexDir="column" align="center" w="full" py={10}>
                            <Text color="gray.500">No categories found.</Text>
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </CustomContainer>
    );
}
