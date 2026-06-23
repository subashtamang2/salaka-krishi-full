import axios from "./axios-interceptor";
import urls from "./urls";

export interface OrderFilters {
  search?: string;
  status?: string;
  payment_status?: string;
  payment_provider?: string;
  date_from?: string;
  date_to?: string;
  includeArchived?: boolean;
  page?: number;
  limit?: number;
}

export function getOrders(filters: OrderFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== "All") {
      params.append(key, String(value));
    }
  });
  const query = params.toString();
  return axios({
    url: `${urls.getOrders.url}${query ? `?${query}` : ""}`,
    method: urls.getOrders.method,
  });
}







export function getOrderById(id: string) {
  const url = urls.getSingleOrder.url.replace(":id", id);
  return axios({
    url,
    method: urls.getSingleOrder.method,
  });
}

export function updateOrderStatus(id: string, status: string, cashCollected?: boolean) {
  const url = urls.updateOrderStatus.url.replace(":id", id);
  return axios({
    url,
    method: urls.updateOrderStatus.method,
    data: { status, ...(cashCollected !== undefined ? { cashCollected } : {}) },
  });
}

export function cancelOrder(id: string, reason: string, note?: string) {
  const url = urls.cancelOrder.url.replace(":id", id);
  return axios({
    url,
    method: urls.cancelOrder.method,
    data: { reason, note },
  });
}

export function archiveOrder(id: string) {
  const url = urls.archiveOrder.url.replace(":id", id);
  return axios({
    url,
    method: urls.archiveOrder.method,
  });
}

export function unarchiveOrder(id: string) {
  const url = urls.archiveOrder.url.replace(":id", id).replace("archive", "unarchive");
  return axios({
    url,
    method: "POST", // Manually setting POST as I haven't updated urls.ts yet
  });
}

export function reopenOrder(id: string, resetCodPayment = false) {
  const url = urls.reopenOrder.url.replace(":id", id);
  return axios({
    url,
    method: urls.reopenOrder.method,
    data: { resetCodPayment },
  });
}

export function toggleCashCollected(id: string, cashCollected: boolean) {
  const url = urls.toggleCashCollected.url.replace(":id", id);
  return axios({
    url,
    method: urls.toggleCashCollected.method,
    data: { cashCollected },
  });
}

export function getOrderCancellations(id: string) {
  const url = urls.getOrderCancellations.url.replace(":id", id);
  return axios({
    url,
    method: urls.getOrderCancellations.method,
  });
}

export function getAllCancellations() {
  return axios({
    url: urls.getAllCancellations.url,
    method: urls.getAllCancellations.method,
  });
}
