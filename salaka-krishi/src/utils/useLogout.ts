import { useNavigate } from "react-router";
import { clearTokens } from "./local-storage";
import routes from "@src/router/routes";
import { useUserStore } from "@src/store/useUserStore";

export default function useLogout() {
  const navigate = useNavigate();
  const resetUser = useUserStore((state) => state.resetUserDetail);
  return () => {
    resetUser();
    clearTokens();
    navigate(routes.auth.base);
  };
}
