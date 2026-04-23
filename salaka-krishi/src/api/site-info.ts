import axios from "@utils/axios-interceptor";
import urls from "./urls";


export function getSiteInfo() {
    return axios.request({
        url: urls.getSiteInfo.url,
        method: urls.getSiteInfo.method,
    });
}
