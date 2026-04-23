
import type { SocialMediaList } from "@src/schema/schema";
import { EMAIL, PHONE } from "@src/utils/constants";
import { FaRegEnvelope } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
// import { FiPhone } from "react-icons/fi";
export const ContactInfo: SocialMediaList[] = [
  {
    id: 1,
    name: EMAIL,
    icon: FaRegEnvelope,
    link: EMAIL,
    href: "Email",
  },
  {
    id: 2,
    name: PHONE,
    icon: FaWhatsapp ,
    link: PHONE,
    href: "Phone",
  },

];
