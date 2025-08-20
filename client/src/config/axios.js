import axios from "axios";
import useAuthStore from "../context/useAuth";

const Axios = axios.create({
  baseURL: "http://localhost:5050/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPrivate = axios.create({
  baseURL: "http://localhost:5050/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosNoHeaders = axios.create({
  baseURL: "http://localhost:5050/api/",
  withCredentials: true,
});

//intercepting instance
const interceptAndRefresh = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      if (
        err.response?.data?.message === "Access token expired" &&
        err.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        console.log("Refreshing token...", originalRequest._retry);
        try {
          useAuthStore.getState().set({ loading: true });

          const refreshRes = await axiosInstance.post("/auth/refresh", {
            headers: {
              authorization: `Bearer ${useAuthStore.getState().token}`,
            },
          });
          const newAccessToken = refreshRes.data.accessToken;
          // Update your memory store
          useAuthStore.getState().setToken(newAccessToken);

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          useAuthStore.getState().set({ loading: false });

          return axiosInstance(originalRequest);
        } catch (refreshErr) {
          // Refresh token failed → force logout
          useAuthStore
            .getState()
            .setError("Session expired, please log in again.");
        }
      } else if (err.response?.data?.message === "Access token expired" && err.response.status === 401 && originalRequest._retry === true) {
        useAuthStore.getState().setError("Session expired, please log in again.");
      }
      return Promise.reject(err);
    }
  );
};

interceptAndRefresh(axiosPrivate);
interceptAndRefresh(axiosNoHeaders);

export default Axios;
