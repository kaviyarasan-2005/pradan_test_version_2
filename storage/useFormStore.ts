import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface FormData {
  draft_id : string;
  id?: string;
  submittedAt?: string;
  date?: string;
  basicDetails?: any;
  landOwnership?: any;
  user_id?:any;
  landDevelopment?: any;
  bankDetails?: any;
  formType:any;
}

interface FormStore {
  data: FormData;
  submittedForms: FormData[];
  loading: boolean;

  setData: (section: keyof FormData, value: any) => void;
  resetData: () => void;
  submitForm: () => Promise<void>;
  loadSubmittedForms: () => Promise<void>;
  clearSubmittedForms: () => Promise<void>;
   setNestedData: (section: keyof FormData, key: string, value: any) => void;
  set2NestedData: (section: keyof FormData, key1: string, key2: string, value: any) => void;
}

export const useFormStore = create<FormStore>((set, get) => ({
  
  data: {},
  submittedForms: [],
  loading: false,

  setData: (section, value) =>
    set((state) => ({
      data: {
        ...state.data,
        [section]: value,
      },
    })),
    setNestedData: (section, key, value) =>
    set((state) => ({
      data: {
        ...state.data,
        [section]: {
          ...(state.data[section] || {}),
          [key]: value,
        },
      },
    })),

  set2NestedData: (section, key1, key2, value) =>
    set((state) => ({
      data: {
        ...state.data,
        [section]: {
          ...(state.data[section] || {}),
          [key1]: {
            ...((state.data[section] || {})[key1] || {}),
            [key2]: value,
          },
        },
      },
    })),


  resetData: () => set({ data: {} }),

  submitForm: async () => {
    const currentData = get().data;
    const allForms = get().submittedForms;

    let updatedForms;

    if (currentData.id) {
      updatedForms = allForms.map((form) =>
        form.id === currentData.id ? { ...form, ...currentData } : form
      );
    } else {
      const formWithMeta: FormData = {
        ...currentData,
        id: Date.now().toString(),
        submittedAt: new Date().toISOString(),
        formStatus: currentData.formStatus,
      };
      updatedForms = [...allForms, formWithMeta];
    }

    await AsyncStorage.setItem("submittedForms", JSON.stringify(updatedForms));
    set({ submittedForms: updatedForms, data: {} });
  },

  loadSubmittedForms: async () => {
    set({ loading: true });
    try {
      const stored = await AsyncStorage.getItem("submittedForms");
      if (stored) {
        set({ submittedForms: JSON.parse(stored) });
      }
    } catch (error) {
      console.error("Failed to load submitted forms", error);
    } finally {
      set({ loading: false });
    }
  },

  clearSubmittedForms: async () => {
    await AsyncStorage.removeItem("submittedForms");
    set({ submittedForms: [] });
  },
}));


interface FormStoreStatusCountData{
  pendingCount_pre?: number;
  approvedCount_pre?: number;
  rejectedCount_pre?: number;
  totalCount_pre?: number;
  pendingCount_post?: number;
  approvedCount_post?: number;
  changerequestedCount_post?: number;
  totalCount_post?: number;
  hasfetched_total?: boolean;
}
//structure of the ZuStand store for total count of forms
interface FormStoreStatus_totalCount {
  status_total: FormStoreStatusCountData;
  setStatus_totalCount: (status_total: FormStoreStatusCountData) => void;
  resetStatus_totalCount: () => void;
}

//structure of the ZuStand store for today's count of forms
interface FormStoreStatus_todayCount {
  status_today: FormStoreStatusCountData;
  setStatus_todayCount: (status_today: FormStoreStatusCountData) => void;
  resetStatus_todayCount: () => void;
}

//global ZuStand store for total count of forms
export const FormStatus_totalCount = create<FormStoreStatus_totalCount>((set) => ({
  status_total: {},

  setStatus_totalCount: (status_total) => set({status_total}),

  resetStatus_totalCount: () => set({ status_total: {} }),
}));

//global ZuStand store for today's count of forms
export const FormStatus_todayCount = create<FormStoreStatus_todayCount>((set) => ({
  status_today: {},

  setStatus_todayCount: (status_today) => set({status_today}),

  resetStatus_todayCount: () => set({ status_today: {} }),
}));