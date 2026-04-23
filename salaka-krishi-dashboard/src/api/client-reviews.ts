import { ClientReviewInterface } from "schema/client-review";
import urls from "./urls";
import axios from "./axios-interceptor";

export function CreateClientReview(payload: ClientReviewInterface) {
  return axios({
    url: urls.createClientReview.url,
    method: urls.createClientReview.method,
    data: payload,
  });
}

export function getClientReviews() {
  return axios({
    url: urls.getClientReviews.url,
    method: urls.getClientReviews.method,
  });
}

export function deleteClientReview(id: string) {
  const url = urls.deleteClientReview.url.replace(":id", id);
  return axios({
    url: url,
    method: urls.deleteClientReview.method,
  });
}

export function getSingleClientReview(id: string) {
  const url = urls.getSingleClientReview.url.replace(":id", id);
  return axios({
    url: url,
    method: urls.getSingleClientReview.method,
  });
}

export function updateClientReview(id: string, payload: ClientReviewInterface) {
  const url = urls.updateClientReview.url.replace(":id", id);
  return axios({
    url: url,
    method: urls.updateClientReview.method,
    data: payload,
  });
}
