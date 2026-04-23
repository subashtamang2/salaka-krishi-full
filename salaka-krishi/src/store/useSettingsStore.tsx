import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type Language = "en" | "np";
export type Currency = "NPR" | "USD";

interface SettingsState {
    language: Language;
    currency: Currency;
    setLanguage: (lang: Language) => void;
    setCurrency: (curr: Currency) => void;
}

export const useSettingsStore = create<SettingsState>()(
    devtools(
        persist(
            (set) => ({
                language: "en",
                currency: "NPR",
                setLanguage: (language) => set({ language }),
                setCurrency: (currency) => set({ currency }),
            }),
            {
                name: "settings-storage",
            }
        )
    )
);
