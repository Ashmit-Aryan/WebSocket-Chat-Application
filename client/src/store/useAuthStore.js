import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";
import io from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ?  import.meta.env.VITE_SERVER_URL  : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
        const response = await api.get("/auth/check",);
        set({ authUser: response.data, isCheckAuth: false });
        get().connectSocket();
    } catch (error) {
        set({ authUser: null});
        console.log("User is not authenticated", error);
    } finally {
        set({ isCheckAuth: false });
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.post("/auth/update-profile", data);
      set({ authUser: { ...get().authUser, ...response.data } }); // ✅ merge, don't replace
      get().connectSocket();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    }
  },

  signUp: async (data)=>{
    set({ isSigningUp: true });
    try{
        const user = await api.post("/auth/signup", data);
        set({ authUser: user.data });

      toast.success("Account created successfully!");
      get().connectSocket();
    }catch(error){
      toast.error(error.response?.data?.message || "Signup failed");
    }finally{
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const user = await api.post("/auth/login", data);
      set({ authUser: user.data });

      toast.success("Logged in successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ authUser: null, socket: null, onlineUsers: [] });
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed",error);
    }
  },

  connectSocket: () => {
    if (get().socket || !get().authUser) return;

    const socket = io('/',{
      withCredentials: true,
    });

    socket.connect();

    set({ socket });


    socket.on("getUserOnline", (users) => {
      set({ onlineUsers: users });
    });

  
  },

   disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
