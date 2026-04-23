import axios from "./axios-interceptor";
import urls from "./urls";

export function getShippingDetails() {
  return axios({
    url: urls.getShippingDetails.url,
    method: urls.getShippingDetails.method,
  });
}

export function deleteShippingDetail(id: string) {
  const url = urls.deleteShippingDetail.url.replace(":id", id);
  return axios({
    url,
    method: urls.deleteShippingDetail.method,
  });
}
