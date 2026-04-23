import { CurrentUser} from "schema/schema";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface UserState {
  user: CurrentUser | null;
  setUser: (user: CurrentUser) => void;
  removeUser: () => void;
}

export const userStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user: CurrentUser) => set(() => ({ user })),
        removeUser: () => set(() => ({ user: null })),
      }),
      {
        name: "user-storage",
      }
    )
  )
);
