import axios from "./axios-interceptor";
import urls from "./urls";

export function forgotPassword(email: string) {
  return axios({
    url: urls.forgotPassword.url,
    method: urls.forgotPassword.method,
    data: { email },
  });
}
