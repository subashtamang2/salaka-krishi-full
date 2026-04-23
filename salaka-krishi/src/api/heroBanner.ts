
import axios from "axios";
import urls from "./urls";
import type { HeroBannerSchema } from "@src/schema/heroBanner";
import type { DataWrapper } from "@src/schema/schema";

export function getAllHeroBanners() {
  return axios<DataWrapper<HeroBannerSchema[]>>({
    url: urls.heroBanner.url,
    method: urls.heroBanner.method,
  });
}

export function getActiveHeroBanners() {
  return axios<DataWrapper<HeroBannerSchema[]>>({
    url: urls.getActiveHeroBanner.url,
    method: urls.getActiveHeroBanner.method,
  });
}

export function getHeroBannerById(id: string) {
  return axios<DataWrapper<HeroBannerSchema>>({
    url: urls.getHeroBannerById.url.replace(":id", id),
    method: urls.getHeroBannerById.method,
  });
}
