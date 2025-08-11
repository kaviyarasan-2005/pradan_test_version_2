import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface DraftData {
  draft_id?: string;
  savedAt?: string;
  date?: string;
  basicDetails?: any;
  landOwnership?: any;
  landDevelopment?: any;
  bankDetails?: any;
  formType?: string;
}

interface DraftStore {
  drafts: DraftData[];
// setdraftData: (section: keyof FormData, value: any) => void;
  loadDrafts: () => Promise<void>;
  saveDraft: (draft: DraftData) => Promise<void>;
  deleteDraft: (id: string) => Promise<void>;
  clearDrafts: () => Promise<void>;
}
export const useDraftStore = create<DraftStore>((set, get)  => ({
  drafts: [],

  loadDrafts: async () => {
    try {
      const stored = await AsyncStorage.getItem("draftForms");
      if (stored) {
        set({ drafts: JSON.parse(stored) });
      }
    } catch (error) {
      console.error("Failed to load drafts", error);
    }
  },
 
  saveDraft: async (draft) => {
    const currentDrafts = get().drafts;

    let updatedDrafts;

    if (draft.id) {
      updatedDrafts = currentDrafts.map((item) =>
        item.id === draft.id ? { ...item, ...draft } : item
      );
    } else {
      const draftWithMeta: DraftData = {
        ...draft,
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
        formStatus: "Draft",
      };
      updatedDrafts = [...currentDrafts, draftWithMeta];
    }

    await AsyncStorage.setItem("draftForms", JSON.stringify(updatedDrafts));
    set({ drafts: updatedDrafts });
  },

  deleteDraft: async (id) => {
    const updated = get().drafts.filter((d) => d.id !== id);
    await AsyncStorage.setItem("draftForms", JSON.stringify(updated));
    set({ drafts: updated });
  },

  clearDrafts: async () => {
    await AsyncStorage.removeItem("draftForms");
    set({ drafts: [] });
  },
}));
