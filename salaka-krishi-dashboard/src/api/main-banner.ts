import urls from "./urls";
import axios from "./axios-interceptor";
import { CreateMainBannerPayload } from "schema/main-banner";


export function addMainBanner(payload: CreateMainBannerPayload) {
  return axios({
    url: urls.addMainBanner.url,
    method: urls.addMainBanner.method,
    data: payload,
  });
}

export function getMainBanner() {
  return axios({
    url: urls.getMainBanner.url,
    method: urls.getMainBanner.method,
  });
}

export function getMainBannerById(id: string) {
  return axios({
    url: urls.getSingleMainBanner.url.replace(":id", id),
    method: urls.getSingleMainBanner.method,
  });
}




export function updateMainBanner(id: string, payload: CreateMainBannerPayload) {
  return axios({
    url: urls.updateMainBanner.url.replace(":id", id),
    method: urls.updateMainBanner.method,
    data: payload,
  });
}

export function deleteMainBanner(id: string) {
  return axios({
    url: urls.deleteMainBanner.url.replace(":id", id),
    method: urls.deleteMainBanner.method,
  });
}
