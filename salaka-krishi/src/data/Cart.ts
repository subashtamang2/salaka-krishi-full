import type { CartItemSchema } from "@src/schema/schema";
import productimage1 from "@assets/images/cart/khuwa.png";
import productimage2 from "@assets/images/cart/brocouly.png";
export const cartData:CartItemSchema[]= [
        {
            id: "1",
            name: "Khuwa",
            image: productimage1,
            price: 45,
            quantity: 1,
        },
        {
            id: "2",
            name: "Brocouli",
            image: productimage2,
            price: 300,
            quantity: 2,
        },
    ];
