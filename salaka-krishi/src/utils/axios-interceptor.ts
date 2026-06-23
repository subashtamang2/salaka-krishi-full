import urls from "@src/api/urls";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
    clearTokens,
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
} from "./local-storage";
import axios from "axios";
import { refreshTokenAPI } from "@src/api/auth";

const requestConfig = (request: InternalAxiosRequestConfig) => {
    request.baseURL = `${import.meta.env.VITE_BACKEND_ENDPOINT}/api`;
    request.headers["accept"] = "application/json";
    // Don't set content-type for FormData — let axios/browser auto-set multipart/form-data with boundary
    if (!(request.data instanceof FormData)) {
        request.headers["content-type"] = "application/json";
    }

    const accessToken = getAccessToken();
    if (accessToken) {
        request.headers["authorization"] = `Bearer ${accessToken}`;
    }

    return request;
};

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

const responseErrorConfig = (error: AxiosError) => {
    const originalRequest: any = error.config;
    const url = error?.config?.url;
    const status = error?.response?.status;
    if (!status || !url) return Promise.reject(error);

    if (status === 401 && url.includes(urls.refreshToken.url)) {
        clearTokens();
        return Promise.reject(error);
    }

    if (status === 401 && !originalRequest?._retry) {
        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers["authorization"] = "Bearer " + token;
                    return axios(originalRequest);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            clearTokens();
            return Promise.reject(error);
        }

        return new Promise(function (resolve, reject) {
            refreshTokenAPI(refreshToken)
                .then((res: any) => {
                    const access_token = res?.data?.data?.access_token;
                    const refresh_token = res?.data?.data?.refresh_token;
                    setAccessToken(access_token);
                    setRefreshToken(refresh_token);
                    originalRequest.headers["authorization"] = "Bearer " + access_token;
                    processQueue(null, access_token);
                    resolve(axios(originalRequest));
                })
                .catch((err) => {
                    processQueue(err, null);
                    clearTokens();
                    reject(err);
                })
                .finally(() => {
                    isRefreshing = false;
                });
        });
    }
    return Promise.reject(error);
};

axios.interceptors.request.use(
    (request) => requestConfig(request),
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => responseErrorConfig(error)
);
export default axios;
