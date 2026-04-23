import { Home } from "@wandersonalwes/iconsax-react";
import { NavItemType } from "types/menu";

const icons = {
  dashboard: Home,
};

const dashboard: NavItemType = {
  id: "dashboard",
  title: "dashboard",
  type: "group",
  url: "/dashboard",
  icon: icons.dashboard,
};

export default dashboard;
