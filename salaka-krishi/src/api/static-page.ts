import axios from "@utils/axios-interceptor";
import urls from "./urls";

export function getPrivacyPolicy() {
  return axios({
    url: urls.getPrivacyPolicy.url,
    method: urls.getPrivacyPolicy.method,
  });
}

export function getTermsAndConditions() {
  return axios({
    url: urls.getTermsAndConditions.url,
    method: urls.getTermsAndConditions.method,
  });
}
