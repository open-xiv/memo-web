import { createContext, useContext } from "react";

export interface HeaderContextType {
    // zone
    zoneName?: string;
    zoneHash?: string;
    setZoneInfo: (name?: string, hash?: string) => void;

    // member
    memberName?: string;
    memberServer?: string;
    setMemberInfo: (name?: string, server?: string) => void;
}

export const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const useHeaderContext = () => {
    const context = useContext(HeaderContext);
    if (context === undefined) {
        throw new Error("useHeaderContext must be used within a HeaderProvider");
    }
    return context;
};