import axios from "./axios-interceptor";
import urls from "./urls";

export function getNewsletters() {
  return axios({
    url: urls.getNewsletters.url,
    method: urls.getNewsletters.method,
  });
}

export function toggleNewsletterStatus(id: string) {
  const url = urls.updateNewsletterStatus.url.replace(":id", id);
  return axios({
    url,
    method: urls.updateNewsletterStatus.method,
  });
}

export function deleteNewsletter(id: string) {
  const url = urls.deleteNewsletter.url.replace(":id", id);
  return axios({
    url,
    method: urls.deleteNewsletter.method,
  });
}

export function getSubscribers() {
  return axios({
    url: urls.getSubscribers.url,
    method: urls.getSubscribers.method,
  });
}

export function deleteSubscriber(id: string) {
  const url = urls.deleteSubscriber.url.replace(":id", id);
  return axios({
    url,
    method: urls.deleteSubscriber.method,
  });
}
