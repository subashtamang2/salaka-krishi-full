const routes = {
    home: "/",
    products: {
        root: "/products",
        dairy: "dairy",
        vegetables: "vegetables",
        vermicompost: "vermicompost",
        seasonalVegetables: "seasonal-vegetables",
    },
    productDetails: "/product/:slug",
    cart: {
        base: "/cart",
        cartCheckout: "/cart/checkout",
        customerDetails: "/cart/shipping-details",
        orderVerification: "/cart/order-verification",
        orderSuccess: "/cart/order-success",
        esewaSuccess: "/esewa-success",
        esewaFailure: "/esewa-failure",
        khaltiSuccess: "/khalti-success",
    },
    orderHistory: "/my-orders",
    orderDetails: "/my-orders/:id",
    wishList: "/wishlist",
    auth: {
        base: "/auth",
        register: "register",
        verifyOtp: "verify-otp",
        success: "success",
    },
    blog: {
        root: "/blog",
        details: ":slug",
    },
    blogDetails: "/blog/:slug",


    about: "/about",
    contact: "/contact",
    help: "/help",
    privacy: "/privacypolicy",
    terms: "/terms",
    deliveryinformation: "/faq",
    searchterms: "/searchterms",
    orderandreturn: "/orderandreturn",
};

export default routes;
