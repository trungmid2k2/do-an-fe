import { create } from "zustand";

const useDataLoginStore = create((set) => ({
  loginData: null,
  setLoginData: (data: any) => set({ loginData: data }),
}));

export default useDataLoginStore;
