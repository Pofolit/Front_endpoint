import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 토큰 자동 추가
instance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("token");
  if (accessToken) {
    if (!config.headers) {
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
    return Promise.reject(error);
  }
);

// 로그인 콜백 헬퍼
export async function handleAuthCallback(token: string) {
  localStorage.setItem("token", token);
  try {
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    const userInfo = {
      email: decodedPayload.email,
      nickname: decodedPayload.nickname,
      id: decodedPayload.sub,
      role: decodedPayload.role,
    };
    localStorage.setItem("user", JSON.stringify(userInfo));
    // ...API 요청 등 추가 로직...
  } catch (e) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    throw e;
  }
}

export default instance;