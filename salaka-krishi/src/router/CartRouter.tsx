import type { RouteObject } from "react-router";
import routes from "./routes";
import OrderSuccess from "@src/pages/dashboard/cart/OrderSuccess";
import OrderVerification from "@src/pages/dashboard/cart/OrderVerification";
import CartView from "@src/pages/dashboard/cart";
import CartCheckout from "@src/pages/dashboard/cart/CartCheckout";


const CartRouter: RouteObject[] = [
    {
        index: true,
        element: <CartView />,
    },
    {
        path: routes.cart.cartCheckout,
        element: <CartCheckout />,
    },
    {
        path: routes.cart.orderVerification,
        element: <OrderVerification />,
    },
    {
        path: routes.cart.orderSuccess,
        element: <OrderSuccess/>,
    },
];

export default CartRouter;
