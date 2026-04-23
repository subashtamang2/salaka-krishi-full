import type { IconType } from "react-icons";
import type { ProductAvailability, ProductSchema } from "./product";

export interface FilterParamsInterface {
  availability?: ProductAvailability[];
  categories?: string[];
  shops?: string[];
  search?: string[];
}
export interface PaginationMeta<T> {
  message: string;
  data: {
    total_no_of_post: number;
    post_per_page: number;
    blogs: T;
  };
}


export interface DataWrapper<T> {
  data: T;
  message: string;
}

export interface wishlistWrapper<T> {
  id: string;
  createdAt: string;
  products: T;
}


export interface HeaderState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isSubNavOpen: boolean;
  toggleSubMenu: () => void;
  setSubNavOpen: (isOpen: boolean) => void,
  navRef: React.RefObject<HTMLDivElement | null>;

}
export interface NavbarItem {
  id: string;
  label: string;
  href: string;
  children?: boolean;
}
export interface FeatureItem {
  id: number;
  icon: string;
  title: string;
  subtitle?: string;
}

export interface SocialMediaList {
  id: number;
  name: string;
  icon: IconType;
  link: string;
  href?: string;
}

export interface OfferCardSchema {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  available: number;
  sold: number;
  image: string;
  thumbnail: string;


}
export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}



export type ReviewSchema = {
  id: string;
  name: string;
  date: string;
  message: string;
  rating: number;

};
export interface DealShowaseSchema {
  title: string;
  subTitle?: string,
  description: string;
  date?: string;
  buttonLink: string | (() => void | Promise<void>);
  images: {
    url: string,
    title: string,
  }[];
}
export interface CategoriesSchema {
  id: number;
  image: string;
  title: string;
  price?: number;

}


export interface BlogSchema {
  id: string;
  image: string;
  title: string;
  date: string,
  description: string;
  slug: string;
  linkUrl?: string;
  category?: string;
}

export interface BrandCardSchema {
  id: string;
  name: string;
  logo: string;
  link?: string;
}
export interface GalleryCardSchema {
  id: string;
  image: string;
  title: string;
}
export interface MissionCardSchema {
  id: string;
  title: string;
  description: string;
}
export type TestimonialSchema = {
  id: string;
  name: string;
  role: string;
  message: string;
  avatar: string;
};
export interface FaqSchema {
  id: string;
  value: string;
  title: string;
  text: string;
  category: string;
}
export type ProductReviewSchema = {
  id: string;
  name: string;
  date: string;
  message: string;
  rating: number;

};
export interface CartItemSchema {
  id: string;
  name?: string;
  image?: string;
  price?: number;
  quantity?: number;
}
export interface GalleryCardSchema {
  id: string;
  title: string;
  image: string;
}

export interface SignUpProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInProps {
  email: string;
  password: string;
}
export type UserRole = "admin" | "user";
export interface UserDetails {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  profileUrl?: string | null;
  role: UserRole;
  noOfProductInCart: number;
  noOfProductInWishlist: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartInterface<T> {
  message: string;
  data: {
    id: string;
    createdAt: string;
    products: {
      product: T;
      quantity: number;
      totalPrice: number;
    }[];
    totalItems: number;
    totalAmount: number;
  };
}
export interface SocialMedias {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  pinterest?: string;
}


export interface SiteInfo {
  id: string;
  name: string;
  logoUrl: string;
  keywords: string[];
  description: string;
  email: string;
  phone: string;
  address?: string;
  socialMediaLinks: SocialMedias;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned";
export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

export interface OrderItemInterface {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  product?: ProductSchema;
}

export interface OrderInterface {
  id: string;
  orderNumber: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  subTotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  cancellationReason?: string;
  isRefundPending?: boolean;
  items: OrderItemInterface[];
  createdAt: string;
  updatedAt: string;
}

export interface staticPageContent {
  id: string;
  key: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
