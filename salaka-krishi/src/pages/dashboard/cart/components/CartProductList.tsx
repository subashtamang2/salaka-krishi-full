import { Flex } from "@chakra-ui/react";
import Cart from "@src/components/cards/Cart";
import type { ProductSchema } from "@src/schema/product";
interface CartProduct {
    product: ProductSchema;
    quantity: number;
    totalPrice: number;
}

export default function CartProductList({ products }: { products: CartProduct[] }) {
    return (
        <>
            <Flex
                borderRightWidth={1}
                flexDir={"column"}>
                {products?.map((product: CartProduct) => (
                    <Cart key={product?.product?.id} product={product} />
                ))}
            </Flex>
        </>
    )
}
