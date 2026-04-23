import routes from "@src/router/routes";
import type { NavbarItem } from "@src/schema/schema";

export const NavbarList: NavbarItem[] = [
    {
        id: "1",
        label: "Home",
        href: routes.home,
    },
    {
        id: "2",
        label: "Products",
        href: routes.products.root,
        children: true,
    },
    {
        id: "3",
        label: "Blog",
        href: routes.blog.root,
    },
    {
        id: "4",
        label: "About",
        href: routes.about,
    },
    {
        id: "5",
        label: "Contact",
        href: routes.contact,
    },

]

export const productsMenu: NavbarItem[] = [
  {
    id: "1",
    label: "Dairy",
    href: `${routes.products.root}/${routes.products.dairy}`,
  },
  {
    id: "2",
    label: "Vegetables",
    href: `${routes.products.root}/${routes.products.vegetables}`,
  },

  {
    id: "3",
    label: "vermicompost",
    href: `${routes.products.root}/${routes.products.vermicompost}`,
  },
  {
    id: "4",
    label: "Seasonal Vegetables",
    href: `${routes.products.root}/${routes.products.seasonalVegetables}`,
  },

];
