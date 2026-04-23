import { Flex, Heading, Image } from "@chakra-ui/react";
import type { CategorySchema } from "@src/schema/categories";
import { useNavigate } from "react-router";
import routes from "@src/router/routes";

import { getImageSrc } from "@src/utils/image";

export default function CategoryCard({ category }: { category: CategorySchema }) {
    const navigate = useNavigate();
    const imageUrl = getImageSrc(category?.imageUrl);
    return (
        <Flex
            flexDir={"column"}
            align="center"
            gap={4}
            justify={"center"}
            cursor="pointer"
            onClick={() => navigate(`${routes.products.root}/${category.slug}`)}
        >

            <Flex
                w={{
                    base: "150px",
                    md: "160px",
                    xl: "178px",
                }}
                h={{
                    base: "150px",
                    md: "160px",
                    xl: "178px"
                }}
                borderRadius="full"
                overflow={"hidden"}
                alignItems="center"
                transition="transform 0.5s ease"
                _hover={{
                    borderWidth: 1,
                    borderColor: "primary.100",
                    transform: "scale(1.1)",
                    shadow: "md",
                }}
                justifyContent="center" >
                <Image
                    src={imageUrl}
                    alt={category?.name}
                    height={"full"}
                    width={"full"}
                    objectFit="cover" />
            </Flex>
            <Heading
                fontSize="xl"
                color="primary.100"
                fontWeight={500}>
                {category?.name}
            </Heading>
        </Flex>
    );
}
