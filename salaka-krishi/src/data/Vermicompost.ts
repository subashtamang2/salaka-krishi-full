import type { CategoriesSchema } from "@src/schema/schema";
import img1 from "@assets/images/vermicompost/Ficus.png";
import img2 from "@assets/images/vermicompost/tomato.png";
import img3 from "@assets/images/vermicompost/onion.png";
import vermicompostImage from "@assets/images/vermicompost/vermicompost.png";

export const vermicompostDealShowcaseData =
{
    images: [
        { url: img1, title: "Ficus" },
        { url: img2, title: "Tomato" },
        { url: img3, title: "Onion" },
    ],
    title: "Where we use Vermicompost ?",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Bibendum est ultricies integer quis. Iaculis urna id volutpat lacus laoreet. Mauris vitae ultricies leo integer malesuada. Ac odio",
    buttonLink: "Explore",
}

export const vermicompostData: CategoriesSchema[] = [
    {
        id: 1,
        image: vermicompostImage,
        title: "Vermicompost",
        price: 80.00,
    },
    {
        id: 2,
        image: vermicompostImage,
        title: "Vermicompost",
        price: 80.00,
    },
    {
        id: 3,
        image: vermicompostImage,
        title: "Vermicompost",
        price: 80.00,
    },
    {
        id: 4,
        image: vermicompostImage,
        title: "Vermicompost",
        price: 80.00,
    },
]

export const featureCardData: CategoriesSchema[] = [
    {
        id: 1,
        image: img1,
        title: "Vermicompost"
    },
    {
        id: 2,
        image: img1,
        title: "Vermicompost"
    },
    {
        id: 3,
        image: img1,
        title: "Vermicompost"
    },

]
