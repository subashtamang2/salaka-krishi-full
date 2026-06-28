import axios from "./axios-interceptor";
import urls from "./urls";
export function resetPassword(token: string, password: string) {
    return axios({
        url: urls.resetPassword.url,
        method: urls.resetPassword.method,
        data: {
            token,
            password,
        },
    });
}
