import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/" : "/";

const useAuthStore = create((set, get) => ({
  userAuth: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,
  isAuthenticated: false,
  onlineUsers: [],
  socket: null,

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ userAuth: res.data.data });
      set({ isAuthenticated: true });

      get().connectSocket();

      toast.success("Account created successfully");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ userAuth: res.data.data });
      set({ isAuthenticated: true });

      get().connectSocket();

      toast.success("Logged in successfully");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ userAuth: null });
      set({ isAuthenticated: false });

      get().disconnectSocket();

      toast.success("Logged out successfully");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ userAuth: res.data });
      set({ isAuthenticated: true });

      get().connectSocket();
    } catch (err) {
      console.log("Error in checkAuth:", err);
      set({ userAuth: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.patch("/auth/update-profile", data);

      set({ userAuth: res.data.data });

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { userAuth, socket: currentSocket } = get();

    if (!userAuth || currentSocket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: userAuth._id,
      },
    });

    socket.connect();

    socket.on("getOnlineUsers", (onlineUsersIds) =>
      set({ onlineUsers: onlineUsersIds })
    );

    set({ socket: socket });
  },

  disconnectSocket: () => {
    const { socket } = get();

    if (!socket?.connected) return;

    socket.disconnect();
  },
}));

export default useAuthStore;
