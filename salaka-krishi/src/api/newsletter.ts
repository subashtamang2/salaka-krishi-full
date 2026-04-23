import axios from "@utils/axios-interceptor";
import urls from "./urls";

export function subscribeNewsletter(email: string) {
    return axios({
        url: urls.newsletter.url,
        method: urls.newsletter.method,
        data: { email },
    });
}
