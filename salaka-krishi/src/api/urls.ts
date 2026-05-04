
const authUrl = "/auth";
const googleLoginUrl = "/auth/google/login";

const urls = {
    refreshToken: {
        url: `${authUrl}/refresh-token`,
        method: "POST",
    },
    googleLogin: {
        url: `${googleLoginUrl}`,
        method: "GET",
    },
    signIn: {
        url: `${authUrl}/login`,
        method: "POST",
    },
    signUp: {
        url: `${authUrl}/register`,
        method: "POST",
    },
    verifyOtp: {
        url: `${authUrl}/verify-otp`,
        method: "POST",
    },
    resendOtp: {
        url: `${authUrl}/resend-otp`,
        method: "POST",
    },
    currentUser: {
        url: `user/current`,
        method: "GET",
    },
    getActiveBanners: {
        url: "banners/active",
        method: "GET",
    },
    getBannerById: {
        url: "banners/:id",
        method: "GET",
    },




    featuredproducts: {
        url: `product/featured`,
        method: "POST",
    },
    addToWishlist: {
        url: "wishlist/:id",
        method: "POST",
    },
    getWishlist: {
        url: "wishlist",
        method: "GET",
    },
    removeWishlistItem: {
        url: "wishlist/:id",
        method: "DELETE",
    },
    addToCart: {
        url: "cart",
        method: "POST",
    },
    getCart: {
        url: "cart",
        method: "GET",
    },
    updateCartItem: {
        url: "cart/:id",
        method: "PATCH",
    },
    removeFromCart: {
        url: "cart/:id",
        method: "DELETE",
    },
    getCategories: {
        url: "categories",
        method: "GET",
    },
    getProductsByFilter: {
        url: "product/filter/:filterType",
        method: "GET",
    },
    getQueryFilterProducts: {
        url: "product/query",
        method: "GET",
    },
    getProductDetails: {
        url: "product/slug/:slug",
        method: "GET",
    },
    getProductById: {
        url: "product/:id",
        method: "GET",
    },
    addProductReview: {
        url: ":productId/review",
        method: "POST",
    },
    getProductReview: {
        url: ":productId/review",
        method: "GET",
    },
    getProductReviewInfo: {
        url: ":productId/review/info",
        method: "GET",
    },
    checkUserReview: {
        url: ":productId/review/check",
        method: "GET",
    },
    getGlobalProductReviews: {
        url: "product-reviews",
        method: "GET",
    },
    getBlog: {
        url: "blog/all",
        method: "GET",
    },
    getBlogByCategory: {
        url: "blog/category/:slug",
        method: "GET",
    },
    getBlogDetails: {
        url: "blog/info/:slug",
        method: "GET",
    },

    getFilterCategories: {
        url: "categories/filter-list",
        method: "GET",
    },
    getSiteInfo: {
        url: "site-info",
        method: "GET",
    },


    contact: {
        url: "contact",
        method: "POST",
    },

    clientReviews: {
        url: "client-reviews",
        method: "GET",
    },

    gallery: {
        url: "gallery",
        method: "GET",
    },
    getFaq: {
        url: "faq",
        method: "GET",
    },
    newsletter: {
        url: "newsletter",
        method: "POST",
    },
    addOverallReview: {
        url: "overall-reviews",
        method: "POST",
    },
    getOverallReview: {
        url: "overall-reviews",
        method: "GET",
    },
    heroBanner: {
        url: "/hero-banner",
        method: "GET",
    },
    getActiveHeroBanner: {
        url: "/hero-banner/active",
        method: "GET",
    },
    getHeroBannerById: {
        url: "/hero-banner/:id",
        method: "GET",
    },
    validateCoupon: {
        url: "coupon/code/:code",
        method: "GET",
    },
    createOrder: {
        url: "orders",
        method: "POST",
    },
    getMyOrders: {
        url: "orders",
        method: "GET",
    },
    getShippingDetails: {
        url: "shipping-details",
        method: "GET",
    },
    getPrivacyPolicy: {
        url: "static-page/privacy-policy",
        method: "GET",
    },
    getTermsAndConditions: {
        url: "static-page/terms-and-conditions",
        method: "GET",
    },
    cancelOrder: {
        url: "orders/:id/cancel",
        method: "POST",
    },
    checkoutSummary: {
        url: "checkout/summary",
        method: "POST",
    },
};
export default urls;
