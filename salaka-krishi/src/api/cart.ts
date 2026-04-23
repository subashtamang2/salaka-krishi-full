import axios from "@utils/axios-interceptor";
import urls from "./urls";

export function addTocart(productId: string, quantity?: number) {
    return axios({
        url: urls.addToCart.url,
        method: urls.addToCart.method,
        data: { productId, quantity },
    });
}

export function updateCartQuantity(productId: string, quantity: number) {
    const url = urls.updateCartItem.url.replace(":id", productId);
    return axios({
        url,
        method: urls.updateCartItem.method,
        data: { quantity },
    });
}

export function getCart() {
    return axios({
        url: urls.getCart.url,
        method: urls.getCart.method,
    });
}

export function removeFromCart(cartItemId: string) {
    const url = urls.removeFromCart.url.replace(":id", cartItemId);
    return axios({
        url,
        method: urls.removeFromCart.method,
    });
}
