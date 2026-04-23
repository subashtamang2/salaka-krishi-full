import axios from "./axios-interceptor";
import urls from "./urls";

export function getSiteProductsInfo() {
  return axios({
    url: urls.getSiteInfo.url,
    method: urls.getSiteInfo.method,
  });
}
