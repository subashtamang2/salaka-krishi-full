
import type { UserDetails } from "@src/schema/schema";
import { USER_INFO } from "@src/utils/constants";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface StoreProps {
    userDetail: UserDetails | null;
    setUserDetail: (user: UserDetails) => void;
    resetUserDetail: () => void;
}

export const useUserStore = create(
    devtools(
        persist<StoreProps>(
            (set) => ({
                userDetail: null,
                setUserDetail: (payload) => set(() => ({ userDetail: payload })),
                resetUserDetail: () => {
                    set(() => ({ userDetail: null }));
                },
            }),
            {
                name: USER_INFO,
            }
        )
    )
);
