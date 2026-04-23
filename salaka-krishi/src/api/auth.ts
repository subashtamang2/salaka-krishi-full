import axios from "@utils/axios-interceptor";
import urls from "./urls";
import type { SignInProps, SignUpProps } from "@src/schema/schema";


export const refreshTokenAPI = (refreshToken: string) => {
    return axios({
        method: urls.refreshToken.method,
        url: urls.refreshToken.url,
        data: { refreshToken },
    });
};

export function googleLoginAPI() {
    return axios({
        method: urls.googleLogin.method,
        url: urls.googleLogin.url,
    });
}

export function signUp(payload: SignUpProps) {
    return axios({
        method: urls.signUp.method,
        url: urls.signUp.url,
        data: payload,
    });
}

export function signIn(payload: SignInProps) {
    return axios({
        url: urls.signIn.url,
        method: urls.signIn.method,
        data: payload,
    });
}

export function LoginAPI(method: string) {
    switch (method) {
        case "google":
            return googleLoginAPI();
        default:
            throw new Error("Unsupported login method");
    }
}

export function verifyOtp(payload: { email: string; otp: string }) {
    return axios({
        url: urls.verifyOtp.url,
        method: urls.verifyOtp.method,
        data: payload,
    });
}

export function resendOtp(payload: { email: string }) {
    return axios({
        url: urls.resendOtp.url,
        method: urls.resendOtp.method,
        data: payload,
    });
}

export function getCurrentUserAPI() {
    return axios({
        url: urls.currentUser.url,
        method: urls.currentUser.method,
    });
}
