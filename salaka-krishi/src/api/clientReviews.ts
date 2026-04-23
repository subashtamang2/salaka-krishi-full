import urls from "./urls";
import axios from "@utils/axios-interceptor";

export function getClientReviews() {
  return axios({
    url: urls.clientReviews.url,
    method: urls.clientReviews.method,
  });
}
