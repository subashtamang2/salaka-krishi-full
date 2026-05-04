import axios from "@utils/axios-interceptor";
import urls from "./urls";

export interface CreateOrderPayload {
    fullName: string;
    address: string;
    phoneNumber: string;
    paymentProvider?: string;
    couponCode?: string;
    deliveryMethod?: string;
}

export function createOrder(data: CreateOrderPayload) {
    return axios({
        url: urls.createOrder.url,
        method: urls.createOrder.method,
        data,
    });
}

export function getMyOrders() {
    return axios({
        url: urls.getMyOrders.url,
        method: urls.getMyOrders.method,
    });
}

export function getOrderDetails(id: string) {
    return axios({
        url: `${urls.getMyOrders.url}/${id}`,
        method: "GET",
    });
}

export function getShippingDetails() {
    return axios({
        url: urls.getShippingDetails.url,
        method: urls.getShippingDetails.method,
    });
}
export function cancelOrder(id: string, reason?: string) {
    return axios({
        url: urls.cancelOrder.url.replace(":id", id),
        method: urls.cancelOrder.method,
        data: { reason },
    });
}
