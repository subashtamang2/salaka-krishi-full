import axios from "./axios-interceptor";
import urls from "./urls";

export function getAllPaymentProofs() {
  return axios({
    url: urls.getPaymentProofs.url,
    method: urls.getPaymentProofs.method,
  });
}

export function getPendingPaymentProofs() {
  return axios({
    url: urls.getPendingPaymentProofs.url,
    method: urls.getPendingPaymentProofs.method,
  });
}

export function approvePaymentProof(id: string, note?: string) {
  return axios({
    url: urls.approvePaymentProof.url.replace(":id", id),
    method: urls.approvePaymentProof.method,
    data: { note },
  });
}

export function rejectPaymentProof(id: string, note?: string) {
  return axios({
    url: urls.rejectPaymentProof.url.replace(":id", id),
    method: urls.rejectPaymentProof.method,
    data: { note },
  });
}
