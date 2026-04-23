import routes from "@src/router/routes";
import { getAccessToken } from "@src/utils/local-storage";
import { Navigate } from "react-router";

export default function AuthRoutes({ children }: { children: React.ReactNode }) {
    const accessToken = getAccessToken();

    if (accessToken) {
        return <Navigate to={routes.home} />;
    }
    return (
        <>
            {children}
        </>
    )
}
