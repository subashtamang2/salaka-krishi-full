import { CreateCoupon } from "schema/coupon";
import axios from "./axios-interceptor";
import urls from "./urls";

export function createCoupon(couponData: CreateCoupon) {
  return axios({
    url: urls.createCoupon.url,
    method: urls.createCoupon.method,
    data: couponData,
  });
}

export function getCoupons() {
  return axios({
    url: urls.getCoupon.url,
    method: urls.getCoupon.method,
  });
}

export function deleteCoupon(id: string) {
  const url = urls.deleteCoupon.url.replace(":id", id);
  return axios({
    url,
    method: urls.deleteCoupon.method,
  });
}

export function getCouponById(id: string) {
  const url = urls.getSingleCoupon.url.replace(":id", id);
  return axios({
    url,
    method: urls.getSingleCoupon.method,
  });
}

export function updateCoupon(id: string, couponData: Partial<CreateCoupon>) {
  const url = urls.updateCoupon.url.replace(":id", id);
  return axios({
    url,
    method: urls.updateCoupon.method,
    data: couponData,
  });
}
