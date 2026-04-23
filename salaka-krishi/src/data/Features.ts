import type { FeatureItem } from "@src/schema/schema";
import image1 from "@src/assets/icon/fast-delivery.svg";
import image2 from "@src/assets/icon/headphones.svg";
import image3 from "@src/assets/icon/Group 2347.svg";
import image4 from "@src/assets/icon/verify.svg";
export const featureData:FeatureItem[] = [
  {
    id: 1,
    icon: image1,
    title: "Free Shipping",
    subtitle: "Free shipping inside Valley",
  },
  {
    id: 2,
    icon: image2,
    title: "Support 24/7",
    subtitle: "We support 24h a day",
  },
  {
    id: 3,
    icon: image3,
    title: "100% Money Back",
    subtitle: "You have 30 days to return",
  },
  {
    id: 4,
    icon: image4,
    title: "Payment Secure",
    subtitle: "We ensure secure payment",
  },
];
