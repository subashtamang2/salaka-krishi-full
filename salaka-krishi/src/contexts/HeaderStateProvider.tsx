import type { HeaderState } from "@src/schema/schema";
import { createContext, useContext } from "react";
interface Props {
    state: HeaderState;
    children: React.ReactNode;
}

const HeaderContext = createContext<HeaderState | undefined>(undefined)
export function HeaderStateProvider({ state, children }: Props) {
    return (
        <HeaderContext.Provider value={state}>
            {children}
        </HeaderContext.Provider>
    )
}

export const useHeaderState = () => {
    const context = useContext(HeaderContext);
    if (!context) {
        throw new Error("useHeaderState must be used within a HeaderStateProvider");
    }
    return context;
}
