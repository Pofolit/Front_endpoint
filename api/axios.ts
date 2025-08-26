import axios from "axios";
import { Payload, UserInfo } from "../types/user";




const instance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 헤더에 토큰 자동탑재
instance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("token");
  if (accessToken) {
    if (!config.headers) {
      console.warn("No headers found, creating headers object");
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터: 401 발생 시 리프레시 토큰으로 재발급
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post<{ accessToken: string; refreshToken: string }>(
            "/api/v1/auth/token/refresh",
            { refreshToken },
            { baseURL: "http://localhost:8080" }
          );
          const { accessToken, refreshToken: newRefreshToken } = res.data;
          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest); // 재요청
        } catch (e) {
          console.error("Failed to refresh token:", e);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error instanceof Error ? error : new Error(error));
  }
);

// 로그인 콜백 헬퍼
export async function handleAuthCallback(token: string, refreshToken?: string) {
  if (!token || typeof token !== "string") return;
  localStorage.setItem("token", token);
  if (refreshToken && typeof refreshToken === "string") {
    localStorage.setItem("refreshToken", refreshToken);
  }
  try {
    const convertToken = token.split(".")[1];
    if (!convertToken) throw new Error("Invalid token format");
    const decodedPayload = JSON.parse(atob(token.split(".")[1]));
    const id = decodedPayload.sub; 
    return id;
  } catch (e) {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    throw e;
  }
}


// 사용자 추가정보 요청 API 
export const fetchUserData = async (id: string): Promise<Payload | null> => {
  try {
    const response = await instance.get<Payload>(`/api/v1/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
};

export default instance;

