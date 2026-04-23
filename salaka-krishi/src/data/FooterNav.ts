
import routes from "@src/router/routes";
import type { NavbarItem } from "@src/schema/schema";

export const FooterNav: NavbarItem[] = [
    {
        id: "1",
        label: "Home",
        href: routes.home,
    },
    {
        id: "2",
        label: "Product",
        href: routes.products.dairy,
    },
    {
        id: "3",
        label: "Contact",
        href: routes.contact,
    },
    {
        id: "5",
        label: "Blog",
        href: routes.blog.root,
    },
    {
        id: "6",
        label: "login",
        href: `${routes.auth.base}/${routes.auth.base}`,
    },
]
export const SupportNav: NavbarItem[] = [
    {
        id: "1",
        label: "Delivery Information",
        href: routes.deliveryinformation,
    },
    {
        id: "2",
        label: "Privacy Policy",
        href: routes.privacy,
    },
    {
        id: "3",
        label: "Terms & Condition",
        href: routes.terms,
    },
    {
        id: "4",
        label: "Search terms",
        href: routes.searchterms,
    },
    {
        id: "5",
        label: "Orders & Return",
        href: routes.orderandreturn,
    },

]
