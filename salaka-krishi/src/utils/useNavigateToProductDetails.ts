import routes from "@src/router/routes";
import { useNavigate } from "react-router";

export default function useNavigateToProductDetails() {
  const navigate = useNavigate();
  return (slug: string) => {
    navigate(routes.productDetails.replace(":slug", slug));
  };
}
