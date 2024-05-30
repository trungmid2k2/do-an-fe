import { create, createStore } from "zustand";

const usePasswordResetStore = create((set) => ({
  passwordResetData: null,
  setPasswordResetData: (data: any) => set({ passwordResetData: data }),
}));

export default usePasswordResetStore;
