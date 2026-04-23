import { create } from "zustand";

interface AuthModalStore {
    isOpen: boolean;
    onSuccess?: () => void;
    openModal: (onSuccess?: () => void) => void;
    closeModal: () => void;
}

export const useAuthModalStore = create<AuthModalStore>((set) => ({
    isOpen: false,
    onSuccess: undefined,
    openModal: (onSuccess) => set({ isOpen: true, onSuccess }),
    closeModal: () => set({ isOpen: false, onSuccess: undefined }),
}));
