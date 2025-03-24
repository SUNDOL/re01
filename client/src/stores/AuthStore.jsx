import { create } from "zustand";

const useAuthStore = create((set) => ({
    accessToken: null,
    setToken: (atk) => set({ accessToken: atk }),
    clearToken: () => set({ accessToken: null })
}));

export default useAuthStore;