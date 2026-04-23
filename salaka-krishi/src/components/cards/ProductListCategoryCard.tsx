import {
    Flex,
    Heading,
    Image,
    Text
} from "@chakra-ui/react";
import { usePrice } from "@src/hooks/usePrice";
import { Link, } from "react-router";
import routes from "@src/router/routes";
import type { ProductSchema } from "@src/schema/product";
import { getImageSrc } from "@src/utils/image";
interface ProductListCategoryCardProps {
    product: ProductSchema
}
export default function ProductListCategoryCard({ product }: ProductListCategoryCardProps) {
    const { formatPrice } = usePrice();
    const productPriceAfterDiscount = product.discountPercentage
        ? product.price - (product.price * product.discountPercentage) / 100
        : product.price;

    return (
        <Link to={routes.productDetails.replace(":slug", product.slug)}>
            <Flex gap={6}>
                <Flex
                    width={{
                        base: "70px",
                        md: "80px"
                    }}
                    height={{
                        base: "90px",
                        md: "100px"
                    }}>
                    <Image
                        src={getImageSrc(product?.imageUrls?.[0])}
                        alt={product?.name}
                        height={"100%"}
                        width={"100%"}
                        objectFit={"contain"} />
                </Flex>

                <Flex
                    justify={"center"}
                    flexDir={"column"} gap={2}>
                    <Flex>
                        <Heading
                            fontSize={"xl"}
                            fontFamily={"primary"}
                            color={"secondary.100"}>
                            {product.name}
                        </Heading>
                    </Flex>

                    <Flex gap={6}>
                        <Text
                            fontFamily={"primary"}
                            fontSize={"xl"}
                            color={"primary.100"}>
                            {formatPrice(productPriceAfterDiscount)}
                        </Text>
                        {(product.discountPercentage ?? 0) > 0 && (
                            <Text
                                fontFamily={"primary"}
                                fontSize={"xl"}
                                color={"text.200"}
                                textDecoration={"line-through"}>
                                {formatPrice(product.price)}
                            </Text>
                        )}
                    </Flex>
                </Flex>

            </Flex>
        </Link>
    )
}
