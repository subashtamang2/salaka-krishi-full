
const urls = {
    login: {
        url: "admin/login",
        method: "post",
    },

    forgotPassword: {
        url: "admin/forgot-password",
        method: "post",
    },
    resetPassword: {
        url: "admin/reset-password",
        method: "post",
    },
    currentStaff: {
        url: "user/current",
        method: "get",
    },
    createStaff: {
        url: "admin",
        method: "post",
    },
    getStaffs: {
        url: "admin",
        method: "get",
    },
    deleteStaff: {
        url: "admin/:id",
        method: "delete",
    },
    getSiteInfo: {
        url: "site-info/details",
        method: "get",
    },
    updatedCurrentUser: {
        url: "admin/:id",
        method: "patch",
    },
    uploadMultipleFiles: {
        url: "files/upload-multiple",
        method: "post",
    },
    uploadSingleFile: {
        url: "files/upload",
        method: "post",
    },

    createCategory: {
        url: "categories",
        method: "post",
    },
    deleteCategory: {
        url: "categories/:id",
        method: "delete",
    },
    getCategories: {
        url: "categories",
        method: "get",
    },
    getSingleCategory: {
        url: "categories/:id",
        method: "get",
    },
    updateCategory: {
        url: "categories/:id",
        method: "patch",
    },
    createCoupon: {
        url: "coupon",
        method: "post",
    },
    getCoupon: {
        url: "coupon",
        method: "get",
    },
    getSingleCoupon: {
        url: "coupon/:id",
        method: "get",
    },
    updateCoupon: {
        url: "coupon/:id",
        method: "patch",
    },
    deleteCoupon: {
        url: "coupon/:id",
        method: "delete",
    },
    createBlog: {
        url: "blog",
        method: "post",
    },
    getBlogs: {
        url: "blog",
        method: "get",
    },
    deleteBlog: {
        url: "blog/:id",
        method: "delete",
    },
    getSingleBlog: {
        url: "blog/:id",
        method: "get",
    },
    updateBlog: {
        url: "blog/:id",
        method: "patch",
    },
    createProducts: {
        url: "product",
        method: "post",
    },
    getProducts: {
        url: "product",
        method: "get",
    },
    deleteProduct: {
        url: "product/:id",
        method: "delete",
    },
    getSingleProduct: {
        url: "product/:id",
        method: "get",
    },
    updateProduct: {
        url: "product/:id",
        method: "patch",
    },
    queryProducts: {
        url: "product/query",
        method: "get",
    },

    getFilteredProducts: {
        url: "product/filter/:filterType",
        method: "get",
    },


    createFaq: {
        url: "faq",
        method: "post",
    },
    getFaq: {
        url: "faq",
        method: "get",
    },
    deleteFaq: {
        url: "faq/:id",
        method: "delete",
    },
    updateFaq: {
        url: "faq/:id",
        method: "patch",
    },
    getSingleFaq: {
        url: "faq/:id",
        method: "get",
    },
    createClientReview: {
        url: "client-reviews",
        method: "post",
    },
    getClientReviews: {
        url: "client-reviews",
        method: "get",
    },
    deleteClientReview: {
        url: "client-reviews/:id",
        method: "delete",
    },
    getSingleClientReview: {
        url: "client-reviews/:id",
        method: "get",
    },
    updateClientReview: {
        url: "client-reviews/:id",
        method: "patch",
    },
    getSubscribers: {
        url: "newsletter",
        method: "get",
    },
    deleteSubscriber: {
        url: "newsletter/:id",
        method: "delete",
    },
    contact: {
        url: "contact",
        method: "get",
    },
    deleteContact: {
        url: "contact/:id",
        method: "delete",
    },
    updateContactStatus: {
        url: "contact/:id",
        method: "patch",
    },
    siteInfo: {
        url: "site-info",
        method: "get",
    },
    addSiteInfo: {
        url: "site-info",
        method: "POST",
    },
    addSocialmedial: {
        url: "site-info/social-media",
        method: "PUT",
    },
    getSocialmedial: {
        url: "site-info/social-media",
        method: "GET",
    },
    addMainBanner: {
        url: "hero-banner",
        method: "POST",
    },
    getMainBanner: {
        url: "hero-banner",
        method: "GET",
    },
    getSingleMainBanner: {
        url: "hero-banner/:id",
        method: "GET",
    },
    updateMainBanner: {
        url: "hero-banner/:id",
        method: "patch",
    },
    deleteMainBanner: {
        url: "hero-banner/:id",
        method: "DELETE",
    },
    termsAndConditions: {
        url: "static-page/terms-and-conditions",
        method: "PUT",
    },
    getTermsAndConditions: {
        url: "static-page/terms-and-conditions",
        method: "GET",
    },
    privacyPolicy: {
        url: "static-page/privacy-policy",
        method: "PUT",
    },
    getPrivacyPolicy: {
        url: "static-page/privacy-policy",
        method: "GET",
    },
    createOfferBanner: {
        url: "banners",
        method: "post",
    },
    getOfferBanners: {
        url: "banners",
        method: "get",
    },
    getSingleOfferBanner: {
        url: "banners/:id",
        method: "get",
    },
    updateOfferBanner: {
        url: "banners/:id",
        method: "patch",
    },
    deleteOfferBanner: {
        url: "banners/:id",
        method: "delete",
    },
    getCustomers: {
        url: "user/all",
        method: "get",
    },
    deleteCustomer: {
        url: "user/:id",
        method: "delete",
    },
    updateCustomerStatus: {
        url: "user/:id",
        method: "patch",
    },
    adminReviews: {
        url: "admin-reviews",
        method: "get",
    },
    deleteAdminReview: {
        url: "admin-reviews/:id",
        method: "delete",
    },
    getNewsletters: {
        url: "newsletter",
        method: "get",
    },
    updateNewsletterStatus: {
        url: "newsletter/:id",
        method: "patch",
    },
    deleteNewsletter: {
        url: "newsletter/:id",
        method: "delete",
    },
    // Orders
    getOrders: {
        url: "orders",
        method: "get",
    },
    getSingleOrder: {
        url: "orders/:id",
        method: "get",
    },
    updateOrderStatus: {
        url: "orders/:id/status",
        method: "patch",
    },
    cancelOrder: {
        url: "orders/:id/cancel",
        method: "post",
    },
    getOrderCancellations: {
        url: "orders/:id/cancellation",
        method: "get",
    },
    getAllCancellations: {
        url: "orders/cancellations",
        method: "get",
    },
    archiveOrder: {
        url: "orders/:id/archive",
        method: "post",
    },
    reopenOrder: {
        url: "orders/:id/reopen",
        method: "post",
    },
    toggleCashCollected: {
        url: "orders/:id/cash-collected",
        method: "patch",
    },
    // Shipping Details
    getShippingDetails: {
        url: "shipping-details/admin",
        method: "get",
    },
    deleteShippingDetail: {
        url: "shipping-details/:id",
        method: "delete",
    },
    getOverallReviews: {
        url: "overall-reviews",
        method: "get",
    },
    deleteOverallReview: {
        url: "overall-reviews/:id",
        method: "delete",
    },
    // Gallery
    getGalleryImages: {
        url: "gallery",
        method: "get",
    },
    getSingleGalleryImage: {
        url: "gallery/:id",
        method: "get",
    },
    createGalleryImage: {
        url: "gallery",
        method: "post",
    },
    updateGalleryImage: {
        url: "gallery/:id",
        method: "patch",
    },
    deleteGalleryImage: {
        url: "gallery/:id",
        method: "delete",
    },

    getPaymentProofs: {
        url: "payment-proof",
        method: "get",
    },
    getPendingPaymentProofs: {
        url: "payment-proof/pending",
        method: "get",
    },
    approvePaymentProof: {
        url: "payment-proof/:id/approve",
        method: "patch",
    },

    rejectPaymentProof: {
        url: "payment-proof/:id/reject",
        method: "patch",
    }
};
export default urls;
