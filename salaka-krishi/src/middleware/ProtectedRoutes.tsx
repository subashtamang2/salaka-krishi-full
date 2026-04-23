import routes from "@src/router/routes";
import { getAccessToken } from "@src/utils/local-storage";
import { Navigate } from "react-router";

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
    const accessToken = getAccessToken();
    if (!accessToken) {
        return <Navigate to={routes.auth.base}></Navigate>
    }
    return (
        <>{children}</>
    )
}
