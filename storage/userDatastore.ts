import { create } from "zustand";

interface userData {
  // user_id?: number;
  id?:number;
  name?: string;
  username?: string;
  role?: string;
  mobile?: number;
  date_of_joining?: Date;
  location?: string;
  photo?: string;
}

interface UserStore {
  user: userData;
  setUser: (user: Partial<userData>) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: {},

  setUser: (updatedFields: Partial<userData>) =>
    set((state) => ({
      user: {
        ...state.user,
        ...updatedFields,
      },
    })),
  logout: () => set({ user: {} }),
}));