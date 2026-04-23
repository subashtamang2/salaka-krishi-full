import axios from "./axios-interceptor";
import urls from "./urls";
import { CreateOfferBannerSchema, UpdateOfferBannerSchema } from "schema/offer-banner";

export function createOfferBanner(payload: CreateOfferBannerSchema) {
  return axios({
    method: urls.createOfferBanner.method,
    url: urls.createOfferBanner.url,
    data: payload,
  });
}

export function getOfferBanners() {
  return axios({
    method: urls.getOfferBanners.method,
    url: urls.getOfferBanners.url,
  });
}

export function getSingleOfferBanner(id: string) {
  return axios({
    method: urls.getSingleOfferBanner.method,
    url: urls.getSingleOfferBanner.url.replace(":id", id),
  });
}

export function updateOfferBanner(id: string, payload: UpdateOfferBannerSchema) {
  return axios({
    method: urls.updateOfferBanner.method,
    url: urls.updateOfferBanner.url.replace(":id", id),
    data: payload,
  });
}

export function deleteOfferBanner(id: string) {
  return axios({
    method: urls.deleteOfferBanner.method,
    url: urls.deleteOfferBanner.url.replace(":id", id),
  });
}
