import axios from "axios";
import Constants from "expo-constants";
import { create } from "zustand";
import { useUserStore } from "./userDatastore";
const url = Constants.expoConfig.extra.API_URL;
export interface DashbdData {
  id: number;
  farmer_name: string;
  form_type: number;
  status: number;
  created_at: string;
  block: string;
  gender: string;
  hamlet:string;
  panchayat:string;
  remarks:string;
}

interface DashbdStore {
  loading: boolean;
  dashbdforms: DashbdData[];
  setForms: (data: DashbdData[]) => void;
  addForm: (form: DashbdData) => void;
  clearForms: () => void;
  loaddashbdForms: () => Promise<void>;
}
// replace with actual

export const DashbdStore = create<DashbdStore>((set) => ({
  loading: false,
  dashbdforms: [],
  setForms: (data) => set({ dashbdforms: data }),
  addForm: (form) =>
    set((state) => ({ dashbdforms: [...state.dashbdforms, form] })),
  clearForms: () => set({ dashbdforms: [] }),

  loaddashbdForms: async () => {
    set({ loading: true });
    try {
    
      const user = useUserStore.getState().user;
      const response = await axios.get(
        `${url}/api/dashboard/getpreviewformsData`,
        { params: { user_id: user?.id } }
      );
      const response_total = response.data;
        // console.log(response.data);
      if (response_total) {
       set({ dashbdforms: response_total });
      }
    } catch (error) {
      console.error("Error loading forms:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
