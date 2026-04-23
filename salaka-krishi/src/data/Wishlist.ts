import type { WishlistSchema } from "@src/schema/wishlist";
import img1 from "@assets/images/wishlist/khuwa.png";
import img2 from "@assets/images/wishlist/brocouly.png";
import img3 from "@assets/images/wishlist/mustard greens.png";

export const wishlist: WishlistSchema[] = [
  {
    id: "1",
    name: "Khuwa",
    price: 150,
    image: img1,
  },
  {
    id: "2",
    name: "Brocolli",
    price: 72,
    image: img2,
  },
  {
    id: "3",
    name: "Mustard greens",
    price: 50,
    image: img3,
  },
  {
    id: "4",
    name: "Mustard greens",
    price: 50,
    image: img1,
  },
  {
    id: "5 ",
    name: "Mustard greens",
    price: 50,
    image: img2,
  },
];
