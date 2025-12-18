import { create } from "zustand";
import Axios, { axiosPrivate } from "../config/axios";

const AUTH_KEY = "authKey";
// Zustand store for authentication
// This store manages user authentication state, including login, registration, and session management and stores in browser storage.
const useAuthStore = create()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: "",
  openModal: false,
  setOpenModal: (bool) => {
    set({ openModal: bool });
  },

  setError: (error) => set({ error }),
  setToken: (token) => {
    Axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
    axiosPrivate.defaults.headers.common["authorization"] = `Bearer ${token}`;
    set({ token });
    console.log("Token Set" + token);
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const result = await axiosPrivate.post("/auth/login", {
        email,
        password,
      });
      if (result.data.message === "success") {
        const { user, accessToken } = result.data;
        //set axios instances to use token
        Axios.defaults.headers.common[
          "authorization"
        ] = `Bearer ${accessToken}`;
        axiosPrivate.defaults.headers.common[
          "authorization"
        ] = `Bearer ${accessToken}`;

        // Store user and token in local storage
        localStorage.setItem(AUTH_KEY, JSON.stringify(true));
        //set the state
        set({
          isAuthenticated: true,
          user: user,
          token: accessToken,
          loading: false,
        });
      }
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Login failed. Please try again.",
      });
      console.log("LOGIN ERR:", error);
    } finally {
      set({ loading: false });
    }
  },
  register: async (email, password, name) => {
    set({ loading: true });
    try {
      const result = await axiosPrivate.post("/auth/register", {
        email,
        password,
        name,
      });
      if (result.data.message === "success") {
        set({
          loading: false,
        });
      }
    } catch (error) {
      set({
        loading: false,
        error: error || "Registration failed. Please try again.",
      });
      console.log("REGISTER ERR:", error);
    } finally {
      set({ loading: false });
    }
  },
  authCheck: async () => {
    set({ loading: true });
    try {
      // Check if user is already authenticated
      const storedAuth = localStorage.getItem(AUTH_KEY);
      const isLoggedIn = JSON.parse(storedAuth) === true;
      if (isLoggedIn) {
        const result = await axiosPrivate.get("/auth/me");
        if (result.data && result.data.user) {
          set({
            isAuthenticated: true,
            user: result.data.user,
            token: result.data.accessToken || null,
            loading: false,
          });
          // Optionally, you can set the token in axios headers
          Axios.defaults.headers.common[
            "authorization"
          ] = `Bearer ${result.data.accessToken}`;
          axiosPrivate.defaults.headers.common[
            "authorization"
          ] = `Bearer ${result.data.accessToken}`;
          //console.log("User authenticated:", result.data);
        }
      } else {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
        });
      }
      return;
    } catch (error) {
      set({ isAuthenticated: false, user: null, token: null, loading: false });
    }
  },
  logout: async () => {
    set({ loading: true });
    try {
      const result = await axiosPrivate.post("/auth/logout");
      if (result.data.message === "success") {
        Axios.defaults.headers.common["authorization"] = "";
        axiosPrivate.defaults.headers.common["authorization"] = "";
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          loading: false,
          error: "",
        });
        // Clear user data from local storage
        localStorage.removeItem(AUTH_KEY);
      }
    } catch (error) {
      set({
        loading: false,
        error: error || "Logout failed. Please try again.",
      });
      console.log("LOGOUT ERR:", error);
    }
  },
}));

export default useAuthStore;
