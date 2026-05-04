import { CreateGalleryPayload, UpdateGalleryPayload } from "schema/gallery";
import axios from "./axios-interceptor";
import urls from "./urls";

export function getGalleryImages() {
  return axios({
    url: urls.getGalleryImages.url,
    method: urls.getGalleryImages.method,
  });
}

export function getGalleryImageById(id: string) {
  const url = urls.getSingleGalleryImage.url.replace(":id", id);
  return axios({
    url: url,
    method: urls.getSingleGalleryImage.method,
  });
}

export function createGalleryImage(payload: CreateGalleryPayload) {
  return axios({
    url: urls.createGalleryImage.url,
    method: urls.createGalleryImage.method,
    data: payload,
  });
}

export function updateGalleryImage(id: string, payload: UpdateGalleryPayload) {
  const url = urls.updateGalleryImage.url.replace(":id", id);
  return axios({
    url: url,
    method: urls.updateGalleryImage.method,
    data: payload,
  });
}

export function deleteGalleryImage(id: string) {
  const url = urls.deleteGalleryImage.url.replace(":id", id);
  return axios({
    url: url,
    method: urls.deleteGalleryImage.method,
  });
}
