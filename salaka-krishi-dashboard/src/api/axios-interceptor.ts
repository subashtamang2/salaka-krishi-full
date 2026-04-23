import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { clearLocalStorage, getAccessToken } from "./local-storage";
import urls from "./urls";

const requestConfig = (request: InternalAxiosRequestConfig) => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  request.baseURL = `${apiUrl}/api`;

  if (
    request.url === urls.uploadSingleFile.url ||
    request.url === urls.uploadMultipleFiles.url
  ) {
    request.headers["content-type"] = "multipart/form-data";
  } else {
    request.headers["content-type"] = "application/json";
    request.headers["accept"] = "application/json";
  }
  if (request.url !== urls.login.url) {
    const token = getAccessToken();
    request.headers["authorization"] = `Bearer ${token || ""}`;
  }
  return request;
};

const responseErrorConfig = (error: AxiosError) => {
  const originalRequest: any = error.config;
  const url = error.config?.url;
  const status = error?.response?.status;

  if (!url || !status) return Promise.reject(error);

  if (status === 401 && window.location.pathname !== "/") {
    originalRequest._retry = true;
    clearLocalStorage();
    window.location.href = "/";
    return Promise.reject(error);
  } else if (status === 403) {
    return Promise.reject(new Error("Access forbidden"));
  } else if (status === 404) {
    return Promise.reject(new Error("Resource not found"));
  } else if (status >= 500) {
    return Promise.reject(new Error("Server error, please try again later"));
  }
  return Promise.reject(error);
};

axios.interceptors.request.use(
  (request) => requestConfig(request),
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => responseErrorConfig(error)
);

export default axios;
