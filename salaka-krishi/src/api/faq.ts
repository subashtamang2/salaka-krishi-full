import axios from "@utils/axios-interceptor";
import urls from "./urls";
export function getFaq(searchQuery?: string | null) {
    return axios({
        url: urls.getFaq.url,
        method: urls.getFaq.method,
        params: {
            search: searchQuery,
        },
    });
}
