import urls from "./urls";
import axios from "@utils/axios-interceptor";

export function getGalery() {
  return axios({
    url: urls.gallery.url,
    method: urls.gallery.method,
  });
}
