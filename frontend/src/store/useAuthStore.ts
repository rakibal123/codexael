import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users`;

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: any) => Promise<boolean>;
    register: (data: any) => Promise<boolean>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (userData) => {
                set({ isLoading: true });
                try {
                    const res = await axios.post(`${API_URL}/login`, userData);
                    set({
                        user: res.data,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    toast.success("Logged in successfully");
                    return true;
                } catch (error: any) {
                    set({ isLoading: false });
                    toast.error(error.response?.data?.message || "Login failed");
                    return false;
                }
            },

            register: async (userData) => {
                set({ isLoading: true });
                try {
                    const res = await axios.post(API_URL, userData);
                    set({
                        user: res.data,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    toast.success("Registered successfully");
                    return true;
                } catch (error: any) {
                    set({ isLoading: false });
                    toast.error(error.response?.data?.message || "Registration failed");
                    return false;
                }
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });
                toast.success("Logged out successfully");
            },
        }),
        {
            name: "codexael-auth",
        }
    )
);
