
import img1 from "@assets/images/lemon.png";
import img2 from "@assets/images/trendy-foods/cauliflower.png";
import img3 from "@assets/images/trendy-foods/lettuce.png";
import img4 from "@assets/images/trendy-foods/brinjal.png";
import img5 from "@assets/images/trendy-foods/donec.png";
import img6 from "@assets/images/trendy-foods/lettuce1.png";
import img7 from "@assets/images/trendy-foods/lettuce1.png";
import img8 from "@assets/images/trendy-foods/tomato.png";
import img9 from "@assets/images/trendy-foods/lettuce.png";
import type { ProductListCategorySchema } from "@src/schema/productListCategory";
// import routes from "@src/router/routes";


export const topRatedProducts: ProductListCategorySchema[] = [
    {
        id: 1,

        title: "Lemon",
        price: 25,
        discountPercentage: 34,
        imageUrl: img1,
        category:"vegetables",
        slug: "lemon",

    },
    {
        id: 2,
        title: "Cauliflower",
        price: 25,
        discountPercentage: 20,
        imageUrl: img2,
        category:"vegetables",
        slug: "cauliflower",

    },
    {
        id: 3,
        title: "Lettuce",
        price: 25,
        discountPercentage: 25,
        imageUrl: img3,
        category:"seasonalVegetables",
        slug: "lettuce",

    },
]
export const bestSellingProducts: ProductListCategorySchema[] = [
    {
        id: 4,
        title: "Brinjal",
        price: 25,
        discountPercentage: 25,
        imageUrl: img4,
        category: "seasonalVegetables",
        slug: "brinjal",

    },
    {
        id: 5,
        title: "Cauliflower",
        price: 25,
        discountPercentage: 25,
        imageUrl: img5,
        category:"seasonalVegetables",
        slug: "cauliflower",

    },
    {
        id: 6,
        title: "Lettuce",
        price: 25,
        discountPercentage: 25,
        imageUrl: img6,
        category:"vegetables",
        slug: "lettuce",

    },
]
export const onSaleProducts: ProductListCategorySchema[] = [
    {
        id: 7,
        title: "Lemon",
        price: 25,
        discountPercentage: 25,
        imageUrl: img7,
        category:"fruits",
        slug: "lemon",

    },
    {
        id: 8,
        title: "Cauliflower",
        price: 25,
        discountPercentage: 25,
        imageUrl: img8,
        category:"vegetables",
        slug: "cauliflower"
    },
    {
        id: 9,
        title: "Lettuce",
        price: 25,
        discountPercentage: 25,
        imageUrl: img9,
        category:"seasonalVegetables",
        slug: "lettuce"
    },
];
