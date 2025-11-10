import axios from "axios";
import { defineStore } from "pinia";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null as string | null,
    user: null as User | null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken && !!state.user,
  },

  actions: {
    setAccessToken(token: string) {
      this.accessToken = token;
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },

    clearAccessToken() {
      this.accessToken = null;
      delete api.defaults.headers.common["Authorization"];
    },

    async fetchUser() {
      try {
        const response = await api.get("/auth/profile");
        this.user = response.data;
      } catch (error) {
        console.error("Failed to fetch user:", error);
        this.clearAccessToken();
        this.user = null;
      }
    },

    async refreshAccessToken() {
      try {
        const response = await api.post("/auth/refresh");
        const { access_token } = response.data;
        this.setAccessToken(access_token);
        return true;
      } catch (error) {
        console.error("Failed to refresh token:", error);
        this.clearAccessToken();
        this.user = null;
        return false;
      }
    },

    async initialize() {
      this.isLoading = true;

      // Try to get new access token using refresh token
      const success = await this.refreshAccessToken();

      if (success) {
        await this.fetchUser();
      }

      this.isLoading = false;
    },

    loginWithGoogle() {
      window.location.href = "http://localhost:3000/auth/google";
    },

    async logout() {
      try {
        await api.post("/auth/logout");
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        this.clearAccessToken();
        this.user = null;
      }
    },
  },
});

// Axios interceptor to handle 401 errors
let isRefreshing = false; // 🔑 Prevents multiple refresh attempts
let failedQueue: any[] = []; // Queue of failed requests

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry if:
    // 1. Request has already been retried
    // 2. Request is to /auth/refresh (prevent infinite loop!)
    // 3. Request is to /auth/login or /auth/google
    if (
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/google")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const authStore = useAuthStore();

      try {
        const success = await authStore.refreshAccessToken();

        if (success && authStore.accessToken) {
          processQueue(null, authStore.accessToken);
          originalRequest.headers["Authorization"] =
            "Bearer " + authStore.accessToken;
          return api(originalRequest);
        } else {
          processQueue(error, null);
          return Promise.reject(error);
        }
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { api };
