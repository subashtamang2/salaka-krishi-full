import urls from "./urls";
import axios from "./axios-interceptor";

export function login(data: { email: string; password: string }) {
  return axios({
    url: urls.login.url,
    method: urls.login.method,
    data,
  });
}
