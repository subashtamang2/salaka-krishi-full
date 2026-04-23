import Home from "@src/pages/Home";
import { type RouteObject } from "react-router";
import routes from "./routes";
import About from "@src/pages/About";
import Contact from "@src/pages/Contact";
import Dairy from "@src/pages/products/Dairy";
import Vegetables from "@src/pages/products/Vegetables";
import Vermicompost from "@src/pages/products/Vermicompost";
import SeasonalVegetables from "@src/pages/products/SeasonalVegetables";
import BlogDetails from "@src/pages/blog/BlogDetails";
import PrivacyPolicies from "@src/pages/static/PrivacyPolicies";
import TermsAndConditions from "@src/pages/static/TermsAndConditions";
import OrderAndReturn from "@src/pages/static/OrderAndReturn";
import DeliveryInformation from "@src/pages/static/DeliveryInformation";
import SearchTerms from "@src/pages/static/searchTerms/SearchTerms";
import Wishlist from "@src/pages/dashboard/wishlist";
import FullGallery from "@src/pages/static/FullGallery";
import ProductDetails from "@src/pages/products/ProductDetails";
import Blog from "@src/pages/blog";
import ProductCollection from "@src/pages/productCollection.tsx/ProductCollection";
import OrderHistory from "@src/pages/dashboard/orders/OrderHistory";
import OrderDetail from "@src/pages/dashboard/orders/OrderDetail";
import ProtectedRoutes from "@src/middleware/ProtectedRoutes";
import NotFound from "@src/pages/NotFound";

const PublicRouter: RouteObject[] = [
    {
        index: true,
        element: <Home />,
    },
    {
        path: routes.orderHistory,
        element: (
            <ProtectedRoutes>
                <OrderHistory />
            </ProtectedRoutes>
        ),
    },
    {
        path: routes.orderDetails,
        element: (
            <ProtectedRoutes>
                <OrderDetail />
            </ProtectedRoutes>
        ),
    },
    {
        path: routes.products.root,
        children: [
            {
                index: true,
                element: <ProductCollection />
            },
            {
                path: routes.products.dairy,
                element: <Dairy />
            },
            {
                path: routes.products.vegetables,
                element: <Vegetables />
            },
            {
                path: routes.products.vermicompost,
                element: <Vermicompost />
            },
            {
                path: routes.products.seasonalVegetables,
                element: <SeasonalVegetables />
            },

        ]
    },
    {
        path: routes.blog.root,
        children: [
            {
                index: true,
                element: <Blog />,
            },
            {
                path: routes.blog.details,
                element: <BlogDetails />,
            },
        ],
    },
    {
        path: routes.productDetails,
        element: <ProductDetails />
    },

    {
        path: "/about",
        element: <About />
    },
    {
        path: "/contact",
        element: <Contact />
    },
    {
        path: routes.wishList,
        element: (
            <ProtectedRoutes>
                <Wishlist />
            </ProtectedRoutes>
        ),
    },

    {
        path: "/gallery",
        element: <FullGallery />
    },
    {
        path: routes.privacy,
        element: <PrivacyPolicies />,
    },
    {
        path: routes.terms,
        element: <TermsAndConditions />,
    },
    {
        path: routes.deliveryinformation,
        element: <DeliveryInformation />,
    },
    {
        path: routes.orderandreturn,
        element: <OrderAndReturn />,
    },
    {
        path: routes.searchterms,
        element: <SearchTerms />,
    },
    {
        path: routes.productDetails,
        element: <ProductDetails />,
    },
    {
        path: routes.about,
        element: <About />,
    },
    {
        path: routes.contact,
        element: <Contact />,
    },
    {
        path: "*",
        element: <NotFound title="Page Not Found" />,
    },


];
export default PublicRouter;
