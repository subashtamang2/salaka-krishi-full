import type { ProductSchema } from "@src/schema/product";
import cauliflower1 from "@assets/images/trendy-foods/cauliflower1.png";
import cauliflower from "@assets/images/trendy-foods/cauliflower.png";
import lettuce from "@assets/images/trendy-foods/lettuce.png";
import donec from "@assets/images/trendy-foods/donec.png";
import tomato from "@assets/images/trendy-foods/tomato.png";
import brinjal from "@assets/images/trendy-foods/brinjal.png";
import lettuce1 from "@assets/images/trendy-foods/lettuce1.png";
import milk from "@assets/images/dairy/milk1.png";
import nauni from "@assets/images/dairy/nauni.png";
import paneer from "@assets/images/dairy/paneer.png";
import ghee from "@assets/images/dairy/ghee.png";
import curd from "@assets/images/dairy/curd.png";
import vermicompostImage from "@assets/images/vermicompost/vermicompost.png";
import lemon from "@assets/images/lemon.png";
export const productsData: ProductSchema[] = [

    {
        id: "1",
        title: "Cauliflower",
        discountPrice: 150,
        price: 35,
        imageUrl: cauliflower1,
        isNew: true,
        isAvailable: true,
        slug: "cauliflower",
    },
    {
        id: "2",
        name: "Cauliflower",
        price: 35,
        discountPercentage: 5,
        imageUrl: cauliflower,
        isFeatured: true,
        createdAt: "2026-01-02",
        isLimitedStock: true,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "cauliflower"
    },
    {
        id: "3",
        name: "Brinjal",
        price: 35,
        discountPercentage: 25,
        imageUrl: brinjal,
        isFeatured: false,
        createdAt: "2026-01-03",
        isLimitedStock: false,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "brinjal"
    },
    {
        id: "4",
        name: "Donec",
        price: 35,
        discountPercentage: 30,
        imageUrl: donec,
        isFeatured: false,
        createdAt: "2026-01-04",
        isLimitedStock: true,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "donec"
    },
    {
        id: "5",
        name: "Lettuce",
        price: 35,
        discountPercentage: 10,
        imageUrl: lemon,
        isFeatured: true,
        createdAt: "2026-01-05",
        isLimitedStock: false,
        category: "seasonalVegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "lettuce"
    },
    {
        id: "6",
        name: "Lettuce",
        price: 35,
        discountPercentage: 25,
        imageUrl: tomato,
        isFeatured: false,
        createdAt: "2026-01-06",
        isLimitedStock: true,
        category: "seasonalVegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "lettuce"
    },
    {
        id: "7",
        name: "Donec",
        price: 35,
        discountPercentage: 25,
        imageUrl: brinjal,
        isFeatured: false,
        createdAt: "2026-01-07",
        isLimitedStock: true,
        category: "seasonalVegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "donec"
    },
    {
        id: "8",
        name: "Donec",
        price: 35,
        discountPercentage: 25,
        imageUrl: lettuce1,
        isFeatured: true,
        createdAt: "2026-01-08",
        isLimitedStock: false,
        category: "seasonalVegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "donec"
    },
    {
        id: "9",
        name: "Cauliflower",
        price: 35,
        discountPercentage: 25,
        imageUrl: cauliflower,
        isFeatured: false,
        createdAt: "2026-01-09",
        isLimitedStock: true,
        category: "seasonalVegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "cauliflower"
    },
    {
        id: "10",
        name: "Lemon",
        price: 35,
        discountPercentage: 25,
        imageUrl: lemon,
        isFeatured: true,
        createdAt: "2026-01-10",
        isLimitedStock: false,
        category: "seasonalVegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "lemon"
    },
    {
        id: "11",
        name: "Lettuce",
        price: 35,
        discountPercentage: 25,
        imageUrl: lettuce,
        isFeatured: true,
        createdAt: "2026-01-11",
        isLimitedStock: false,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "lettuce"
    },
    {
        id: "12",
        name: "Vermicompost",
        price: 35,
        imageUrl: vermicompostImage,
        isFeatured: true,
        createdAt: "2026-01-12",
        isLimitedStock: false,
        category: "vermicompost",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "vermicompost"
    },
    {
        id: "13",
        name: "Vermicompost",
        price: 35,
        discountPercentage: 25,
        imageUrl: vermicompostImage,
        isFeatured: false,
        createdAt: "2026-01-13",
        isLimitedStock: true,
        category: "vermicompost",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "vermicompost"
    },
    {
        id: "14",
        name: "Vermicompost",
        price: 35,
        imageUrl: vermicompostImage,
        isFeatured: false,
        createdAt: "2026-01-14",
        isLimitedStock: true,
        category: "vermicompost",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "vermicompost"
    },
    {
        id: "15",
        name: "Vermicompost",
        price: 35,
        discountPercentage: 25,
        imageUrl: vermicompostImage,
        isFeatured: true,
        createdAt: "2026-01-15",
        isLimitedStock: false,
        category: "vermicompost",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "vermicompost"
    },
    {
        id: "16",
        name: "Donec",
        price: 35,
        discountPercentage: 25,
        imageUrl: cauliflower1,
        isFeatured: true,
        createdAt: "2026-01-16",
        isLimitedStock: false,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "donec"
    },
    {
        id: "17",
        name: "Cauliflower",
        price: 35,
        discountPercentage: 25,
        imageUrl: cauliflower,
        isFeatured: true,
        createdAt: "2026-01-17",
        isLimitedStock: false,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "cauliflower"
    },
    {
        id: "18",
        name: "Cauliflower",
        price: 35,
        imageUrl: cauliflower,
        isFeatured: true,
        createdAt: "2026-01-18",
        isLimitedStock: false,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "cauliflower"
    },
    {
        id: "19",
        name: "Lettuce",
        price: 35,
        discountPercentage: 25,
        imageUrl: cauliflower,
        isFeatured: false,
        createdAt: "2026-01-19",
        isLimitedStock: true,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "lettuce"
    },
    {
        id: "20",
        name: "Donec",
        price: 35,
        imageUrl: cauliflower,
        isFeatured: false,
        createdAt: "2026-01-20",
        isLimitedStock: true,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "donec"
    },
    {
        id: "21",
        name: "Lettuce",
        price: 35,
        imageUrl: cauliflower,
        isFeatured: true,
        createdAt: "2026-01-21",
        isLimitedStock: false,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "lettuce"
    },
    {
        id: "22",
        name: "Lettuce",
        price: 35,
        imageUrl: cauliflower,
        isFeatured: true,
        createdAt: "2026-01-22",
        isLimitedStock: false,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "lettuce"
    },
    {
        id: "23",
        name: "Donec",
        price: 35,
        imageUrl: cauliflower,
        isFeatured: false,
        createdAt: "2026-01-23",
        isLimitedStock: true,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "donec"
    },
    {
        id: "24",
        name: "Donec",
        price: 35,
        imageUrl: cauliflower,
        isFeatured: false,
        createdAt: "2026-01-24",
        isLimitedStock: true,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "donec"
    },
    {
        id: "25",
        name: "Cauliflower",
        price: 35,
        discountPercentage: 25,
        imageUrl: cauliflower,
        isFeatured: true,
        createdAt: "2026-01-25",
        isLimitedStock: false,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "cauliflower"
    },
    {
        id: "26",
        name: "Cauliflower",
        price: 35,
        imageUrl: cauliflower,
        isFeatured: true,
        createdAt: "2026-01-26",
        isLimitedStock: false,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "cauliflower"
    },
    {
        id: "27",
        name: "Lettuce",
        price: 35,
        imageUrl: cauliflower,
        isFeatured: false,
        createdAt: "2026-01-27",
        isLimitedStock: true,
        category: "vegetables",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "lettuce"
    },
    {
        id: "28",
        name: "Milk",
        price: 35,
        imageUrl: milk,
        isFeatured: true,
        createdAt: "2026-01-28",
        isLimitedStock: false,
        category: "milk",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "milk"
    },
    {
        id: "29",
        name: "Nauni",
        price: 35,
        imageUrl: nauni,
        isFeatured: false,
        createdAt: "2026-01-29",
        isLimitedStock: true,
        category: "milk",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "milk"
    },
    {
        id: "30",
        name: "Paneer",
        price: 35,
        discountPercentage: 25,
        imageUrl: paneer
        , isFeatured: true,
        createdAt: "2026-01-30",
        isLimitedStock: false,
        category: "milk",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "milk"
    },
    {
        id: "31",
        name: "Ghee",
        price: 35,
        discountPercentage: 25,
        imageUrl: ghee,
        isFeatured: true,
        createdAt: "2026-01-31",
        isLimitedStock: false,
        category: "milk",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "ghee"
    },
    {
        id: "32",
        name: "Curd",
        price: 35,
        imageUrl: curd,
        isFeatured: false,
        createdAt: "2026-02-01",
        isLimitedStock: true,
        category: "milk",
        description: `
This premium organic fertilizer is specially formulated to improve soil health and increase crop productivity. It enhances nutrient absorption, strengthens plant roots, and supports sustainable farming practices. Suitable for vegetables, fruits, and grains, it delivers visible results within a short time.

Made from 100% natural ingredients, this fertilizer is safe for long-term use and does not harm soil microorganisms. It improves water retention, reduces soil erosion, and helps maintain balanced soil pH. Farmers can confidently use it for both small gardens and large-scale farming.

Regular application promotes healthier plant growth, greener leaves, and higher yields. For best results, apply during early morning or evening hours and follow the recommended dosage. This product is ideal for farmers looking for eco-friendly and cost-effective solutions.
`,
        slug: "curd"
    },
];
