import axios from "./axios-interceptor";
import urls from "./urls";

export function getReviews(params?: any) {
  return axios({
    url: urls.adminReviews.url,
    method: urls.adminReviews.method,
    params,
  });
}

export function deleteReview(id: string) {
  const url = urls.deleteAdminReview.url.replace(":id", id);
  return axios({
    url,
    method: urls.deleteAdminReview.method,
  });
}
