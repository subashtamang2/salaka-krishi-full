import axios from "@utils/axios-interceptor";
import urls from "./urls";

export function addToWishlist(id: string) {
    return axios({
        url: urls.addToWishlist.url.replace(":id", id),
        method: urls.addToWishlist.method,
    });
}

export function getWishlist() {
    return axios({
        url: urls.getWishlist.url,
        method: urls.getWishlist.method,
    });
}

export function removeWishlistItem(id: string) {
    return axios({
        url: urls.removeWishlistItem.url.replace(":id", id),
        method: urls.removeWishlistItem.method,
    });
}
