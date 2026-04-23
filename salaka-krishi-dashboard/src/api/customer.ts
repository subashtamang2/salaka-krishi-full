import axios from "./axios-interceptor";
import urls from "./urls";

export function getCustomers() {
  return axios({
    url: urls.getCustomers.url,
    method: urls.getCustomers.method,
  });
}

export function deleteCustomer(id: string) {
  const url = urls.deleteCustomer.url.replace(":id", id);
  return axios({
    url,
    method: urls.deleteCustomer.method,
  });
}

export function updateCustomerStatus(id: string, status: string) {
  const url = urls.updateCustomerStatus.url.replace(":id", id);
  return axios({
    url,
    method: urls.updateCustomerStatus.method,
    data: { status },
  });
}
