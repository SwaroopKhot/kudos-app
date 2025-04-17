// http.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const httpInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - adds token to headers
httpInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - handles 401 and refreshes token
httpInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired
    // if (
    //   error.response &&
    //   error.response.status === 401 &&
    //   !originalRequest._retry
    // ) {
    //   originalRequest._retry = true;

    //   const refreshToken = localStorage.getItem("refresh_token");
    //   if (refreshToken) {
    //     try {
    //       const response = await axios.post(`${BASE_URL}/api/token/refresh/`, {
    //         refresh: refreshToken,
    //       });

    //       const newAccessToken = response.data.access;
    //       localStorage.setItem("access_token", newAccessToken);

    //       // Update header and retry original request
    //       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    //       return httpInstance(originalRequest);
    //     } catch (refreshError) {
    //       console.error("Refresh token invalid or expired");
    //       localStorage.clear();
    //       // window.location.href = "/";
    //       return Promise.reject(refreshError);
    //     }
    //   } else {
    //     // No refresh token, redirect
    //     localStorage.clear();
    //     // window.location.href = "/";
    //   }
    // }

    return Promise.reject(error);
  }
);

export default httpInstance;
