import axios from "@utils/axios-interceptor";
import urls from "./urls";
export function getCategories() {
    return axios({
        url: urls.getCategories.url,
        method: urls.getCategories.method,
    });
}

export function getFilterCategories() {
    return axios({
        url: urls.getFilterCategories.url,
        method: urls.getFilterCategories.method,
    });
}
