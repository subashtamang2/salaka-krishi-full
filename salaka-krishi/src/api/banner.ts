import axios from "axios";
import urls from "./urls";
import type { BannerSchema } from "@src/schema/banner";

export function getActiveBanners() {
  return axios<BannerSchema[]>({
    url: urls.getActiveBanners.url,
    method: urls.getActiveBanners.method,
  });
}

export function getBannersByTag(tag: string) {
  return axios<BannerSchema[]>({
    url: `${urls.getActiveBanners.url}?tag=${tag}`,
    method: urls.getActiveBanners.method,
  });
}
