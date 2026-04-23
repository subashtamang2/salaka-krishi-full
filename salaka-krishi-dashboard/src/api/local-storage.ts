const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

export function getAccessToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem(ACCESS_TOKEN);
  }
  return null; // fallback for server
}

export function setAccessToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN, token);
  }
}

export function clearLocalStorage() {
  if (typeof window !== "undefined") {
    localStorage.clear();
  }
}

export function setRefreshToken(token: string) {
  localStorage.setItem(REFRESH_TOKEN, token);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN);
}
