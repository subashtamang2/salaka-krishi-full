import type { RouteObject } from "react-router";
import routes from "./routes";
import Login from "@src/pages/auth/Login";
import Register from "@src/pages/auth/Register";
import LoginSuccess from "@src/pages/auth/LoginSuccess";
import VerifyOTP from "@src/pages/auth/VerifyOTP";

const AuthRouter: RouteObject[] = [
    {
        index: true,
        element: <Login />,
    },
    {
        path: routes.auth.register,
        element: <Register />,
    },
    {
        path: routes.auth.verifyOtp,
        element: <VerifyOTP />
    },
    {
        path: routes.auth.success,
        element: <LoginSuccess />
    }
];
export default AuthRouter;
