import urls from "./urls";
import axios from "./axios-interceptor";

export function getOverallReviews() {
  return axios({
    url: urls.getOverallReviews.url,
    method: urls.getOverallReviews.method,
  });
}

export function deleteOverallReview(id: string) {
  const url = urls.deleteOverallReview.url.replace(":id", id);
  return axios({
    url: url,
    method: urls.deleteOverallReview.method,
  });
}
