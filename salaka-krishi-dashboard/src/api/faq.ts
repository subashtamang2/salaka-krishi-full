import { CreateFaqSchema, UpdateFaqSchema } from "schema/faq";
import axios from "./axios-interceptor";
import urls from "./urls";

export function createFaq(payload: CreateFaqSchema) {
  return axios({
    method: urls.createFaq.method,
    url: urls.createFaq.url,
    data: payload,
  });
}

export function getFaq() {
  return axios({
    method: urls.getFaq.method,
    url: urls.getFaq.url,
  });
}

export function deleteFaq(id: string) {
  return axios({
    method: urls.deleteFaq.method,
    url: urls.deleteFaq.url.replace(":id", id),
  });
}

export function updateFaq(id: string, payload: UpdateFaqSchema) {
  return axios({
    method: urls.updateFaq.method,
    url: urls.updateFaq.url.replace(":id", id),
    data: payload,
  });
}

export function getSingleFaq(id: string) {
  return axios({
    method: urls.getSingleFaq.method,
    url: urls.getSingleFaq.url.replace(":id", id),
  });
}
