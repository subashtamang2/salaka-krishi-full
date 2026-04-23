import urls from "./urls";
import axios from "./axios-interceptor";

export function termsAndConditions(content: string) {
  return axios({
    url: urls.termsAndConditions.url,
    method: urls.termsAndConditions.method,
    data: { content },
  });
}

export function getTermsAndConditions() {
  return axios({
    url: urls.getTermsAndConditions.url,
    method: urls.getTermsAndConditions.method,
  });
}

export function privacyPolicy(content: string) {
  return axios({
    url: urls.privacyPolicy.url,
    method: urls.privacyPolicy.method,
    data: { content },
  });
}

export function getPrivacyPolicy() {
  return axios({
    url: urls.getPrivacyPolicy.url,
    method: urls.getPrivacyPolicy.method,
  });
}
