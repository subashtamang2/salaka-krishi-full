export const FAQ_CATEGORY = {
    Shipping: "Shipping",
    Product: "Product",
    Order: "Order",
    Returns: "Returns",
} as const;


export type FaqCategoryType = typeof FAQ_CATEGORY[keyof typeof FAQ_CATEGORY];


export interface faq {
    id: string;
    question: string;
    slug: string;
    answer: string;
    category: FaqCategoryType;
    createdAt: string;
    updatedAt: string;
}

export interface FaqResponse {
    category: FaqCategoryType;
    faqs: faq[];
}
