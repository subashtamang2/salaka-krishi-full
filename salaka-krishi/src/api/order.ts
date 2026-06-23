// import axios from "@utils/axios-interceptor";
// import urls from "./urls";

// export interface CreateOrderPayload {
//     fullName: string;
//     address: string;
//     phoneNumber: string;
//     paymentProvider?: string;
//     couponCode?: string;
//     deliveryMethod?: string;
// }

// export function createOrder(data: CreateOrderPayload) {
//     return axios({
//         url: urls.createOrder.url,
//         method: urls.createOrder.method,
//         data,
//     });
// }

// export function getMyOrders() {
//     return axios({
//         url: urls.getMyOrders.url,
//         method: urls.getMyOrders.method,
//     });
// }

// export function getOrderDetails(id: string) {
//     return axios({
//         url: `${urls.getMyOrders.url}/${id}`,
//         method: "GET",
//     });
// }

// export function getShippingDetails() {
//     return axios({
//         url: urls.getShippingDetails.url,
//         method: urls.getShippingDetails.method,
//     });
// }
// export function cancelOrder(id: string, reason?: string) {
//     return axios({
//         url: urls.cancelOrder.url.replace(":id", id),
//         method: urls.cancelOrder.method,
//         data: { reason },
//     });
// }



// // for onlie payment static qr
// export function uploadScreenshot(file: File) {
//     const formData = new FormData();
//     formData.append("file", file);
//     return axios({
//         url: "/files/upload",
//         method: "POST",
//         data: formData,
//         headers: {
//             "Content-Type": "multipart/form-data",
//         }
//     });
// }
// export function submitPaymentProof(orderId: string, screenshortUrl: string, screenshotName?: string) {
//     return axios({
//         url: "/payment-prof/upload",
//         method: "POST",
//         data: {
//             orderId,
//             screenshortUrl,
//             screenshotName,
//         },
//     });
// }


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

export function uploadScreenshot(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return axios({
        url: "/files/upload",
        method: "POST",
        data: formData,
        // Don't set Content-Type manually — axios will auto-set multipart/form-data with the correct boundary
    });
}

export function submitPaymentProof(orderId: string, screenshotUrl: string, screenshotName?: string) {
    return axios({
        url: "/payment-proof/upload",
        method: "POST",
        data: {
            orderId,
            screenshotUrl,
            screenshotName,
        },
    });
}
