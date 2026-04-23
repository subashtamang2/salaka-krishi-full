import urls from "./urls";
import axios from "./axios-interceptor";

export function getContacts() {
  return axios({
    url: urls.contact.url,
    method: urls.contact.method,
  });
}

export function deleteContact(id: string) {
  return axios({
    url: urls.deleteContact.url.replace(":id", id),
    method: urls.deleteContact.method,
  });
}

export function updateContactStatus(id: string, status: string) {
  return axios({
    url: urls.updateContactStatus.url.replace(":id", id),
    method: urls.updateContactStatus.method,
    data: { status },
  });
}
