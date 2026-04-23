import {
    Call,
    DirectInbox,
    Setting,
    ReceiptItem,
    Truck,
    Category2,
    Box1,
    TicketDiscount,
    Edit,
    MessageQuestion,
    Star1,
    Image,
    Gallery,
    People,
    UserSquare,
    MessageText,
    SecuritySafe,
    DocumentText,
    CloseCircle,
} from "@wandersonalwes/iconsax-react";
import { NavItemType } from "types/menu";

const icons = {
    categories: Category2,
    products: Box1,
    coupons: TicketDiscount,
    blogs: Edit,
    faqs: MessageQuestion,
    clientReviews: Star1,
    mainBanners: Image,
    offerBanners: Gallery,
    staffs: People,
    customers: UserSquare,
    reviews: MessageText,
    orders: ReceiptItem,
    orderCancellations: CloseCircle,
    shipping: Truck,
    newsletter: DirectInbox,
    contact: Call,
    setting: Setting,
    privacy: SecuritySafe,
    terms: DocumentText,
    overallReviews: MessageText,
};

const PageList: NavItemType = {
    id: "page",
    title: "pages",
    type: "group",
    children: [
        // ── Core Commerce ──
        {
            id: "orders",
            title: "Orders",
            type: "item",
            url: "/dashboard/orders",
            icon: icons.orders,
        },
        {
            id: "order-cancellations",
            title: "Order Cancellations",
            type: "item",
            url: "/dashboard/order-cancellations",
            icon: icons.orderCancellations,
        },
        {
            id: "Products",
            title: "Products",
            type: "collapse",
            icon: icons.products,
            children: [
                {
                    id: "ViewProducts",
                    title: "View Products",
                    type: "item",
                    url: "/dashboard/product",
                },
                {
                    id: "AddProducts",
                    title: "Add Products",
                    type: "item",
                    url: "/dashboard/product/add",
                },
            ],
        },
        {
            id: "Categories",
            title: "Categories",
            type: "collapse",
            icon: icons.categories,
            children: [
                {
                    id: "ViewCategories",
                    title: "View Categories",
                    type: "item",
                    url: "/dashboard/category",
                },
                {
                    id: "AddCategory",
                    title: "Add Categories",
                    type: "item",
                    url: "/dashboard/category/add",
                },
            ],
        },
        {
            id: "Coupons",
            title: "Coupons",
            type: "collapse",
            icon: icons.coupons,
            children: [
                {
                    id: "ViewCoupons",
                    title: "View Coupons",
                    type: "item",
                    url: "/dashboard/coupon",
                },
                {
                    id: "AddCoupons",
                    title: "Add Coupons",
                    type: "item",
                    url: "/dashboard/coupon/add",
                },
            ],
        },

        // ── Users & Shipping ──
        {
            id: "Customers",
            title: "Customers",
            type: "item",
            url: "/dashboard/customer",
            icon: icons.customers,
        },
        {
            id: "shipping",
            title: "Shipping Details",
            type: "item",
            url: "/dashboard/shipping",
            icon: icons.shipping,
        },

        // ── Marketing & Banners ──
        {
            id: "Mainbanners",
            title: "Main Banners",
            type: "collapse",
            icon: icons.mainBanners,
            children: [
                {
                    id: "ViewMainBanners",
                    title: "View Main Banners",
                    type: "item",
                    url: "/dashboard/main-banner",
                },
                {
                    id: "AddMainBanners",
                    title: "Add Main  Banners",
                    type: "item",
                    url: "/dashboard/main-banner/add",
                },
            ],
        },
        {
            id: "Offerbanners",
            title: "Offer Banners",
            type: "collapse",
            icon: icons.offerBanners,
            children: [
                {
                    id: "ViewOfferBanners",
                    title: "View Offer Banners",
                    type: "item",
                    url: "/dashboard/offer-banner",
                },
                {
                    id: "AddOfferBanners",
                    title: "Add Offer  Banners",
                    type: "item",
                    url: "/dashboard/offer-banner/add",
                },
            ],
        },

        // ── Content ──
        {
            id: "Blogs",
            title: "Blogs",
            type: "collapse",
            icon: icons.blogs,
            children: [
                {
                    id: "ViewBlogs",
                    title: "View Blogs",
                    type: "item",
                    url: "/dashboard/blog",
                },
                {
                    id: "AddBlogs",
                    title: "Add Blogs",
                    type: "item",
                    url: "/dashboard/blog/add",
                },
            ],
        },
        {
            id: "Faqs",
            title: "Faqs",
            type: "collapse",
            icon: icons.faqs,
            children: [
                {
                    id: "ViewFaqs",
                    title: "View Faqs",
                    type: "item",
                    url: "/dashboard/faq",
                },
                {
                    id: "AddFaqs",
                    title: "Add Faqs",
                    type: "item",
                    url: "/dashboard/faq/add",
                },
            ],
        },

        // ── Reviews & Feedback ──
        {
            id: "reviews",
            title: "Product Reviews",
            type: "item",
            url: "/dashboard/reviews",
            icon: icons.reviews,
        },
        {
            id: "overallReviews",
            title: "Overall Reviews",
            type: "item",
            url: "/dashboard/overall-reviews",
            icon: icons.overallReviews,
        },
        {
            id: "ClientsReviews",
            title: "Clients Reviews",
            type: "collapse",
            icon: icons.clientReviews,
            children: [
                {
                    id: "ViewClientsReviews",
                    title: "View Clients Reviews",
                    type: "item",
                    url: "/dashboard/testimonials",
                },
                {
                    id: "AddClientsReviews",
                    title: "Add Clients Reviews",
                    type: "item",
                    url: "/dashboard/testimonials/add",
                },
            ],
        },

        // ── Communication ──
        {
            id: "newsletter",
            title: "Newsletter",
            type: "item",
            url: "/dashboard/newsletter",
            icon: icons.newsletter,
        },
        {
            id: "contact",
            title: "Contact",
            type: "item",
            url: "/dashboard/contact",
            icon: icons.contact,
        },

        // ── Staff & Administration ──
        {
            id: "Staffs",
            title: "Staffs",
            type: "collapse",
            icon: icons.staffs,
            children: [
                {
                    id: "MyProfile",
                    title: "My Profile",
                    type: "item",
                    url: "/dashboard/profile",
                },
                {
                    id: "View Staffs",
                    title: "View Staffs",
                    type: "item",
                    url: "/dashboard/staff",
                },
                {
                    id: "Add Staffs",
                    title: "Add Staffs",
                    type: "item",
                    url: "/dashboard/staff/add",
                    roles: ["SuperAdmin"],
                },
            ],
        },

        // ── Settings & Legal ──
        {
            id: "setting",
            title: "Setting",
            type: "item",
            url: "/dashboard/setting",
            icon: icons.setting,
        },
        {
            id: "privacy-policy",
            title: "Privacy Policy",
            type: "item",
            url: "/dashboard/privacy-policy",
            icon: icons.privacy,
        },
        {
            id: "terms-and-conditions",
            title: "Terms and Conditions",
            type: "item",
            url: "/dashboard/terms-and-conditions",
            icon: icons.terms,
        },
    ],
};

export default PageList;
