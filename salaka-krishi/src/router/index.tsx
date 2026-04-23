import { createBrowserRouter, RouterProvider } from "react-router";
import routes from "./routes";
import PrimaryLayout from "@src/layouts/PrimaryLayout";
import PublicRouter from "./PrimaryRoutes";
import AuthLayout from "@src/layouts/AuthLayout";
import CartLayout from "@src/layouts/CartLayout";
import CartRouter from "./CartRouter";
import AuthRoutes from "@src/middleware/AuthRoutes";
import AuthRouter from "./AuthRouter";
import EsewaSuccess from "@src/pages/dashboard/cart/EsewaSuccess";
import EsewaFailure from "@src/pages/dashboard/cart/EsewaFailure";
import KhaltiSuccess from "@src/pages/dashboard/cart/KhaltiSuccess";
import ProtectedRoutes from "@src/middleware/ProtectedRoutes";


const router = createBrowserRouter([
    {
        path: routes.home,
        element: <PrimaryLayout />,
        children: PublicRouter,
    },
    {
        path: routes.auth.base,
        element: (<>
            <AuthRoutes>
                <AuthLayout />
            </AuthRoutes>
        </>
        ),
        children: AuthRouter,

    },

    {
        path: routes.cart.base,
        element: (
            <ProtectedRoutes>
                <CartLayout />
            </ProtectedRoutes>
        ),
        children: CartRouter,
    },
    {
        path: routes.cart.esewaSuccess,
        element: <EsewaSuccess />,
    },
    {
        path: routes.cart.esewaFailure,
        element: <EsewaFailure />,
    },
    {
        path: routes.cart.khaltiSuccess,
        element: <KhaltiSuccess />,
    },
]);

export default function Router() {
    return <RouterProvider router={router} />;
}
