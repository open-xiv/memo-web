import type {ReactNode} from "react";
import {useCallback, useState} from "react";
import {HeaderContext, type HeaderContextType} from "@/context/HeaderContext.ts";

export const HeaderProvider = ({children}: { children: ReactNode }) => {
    // zone
    const [zoneName, setZoneName] = useState<string | undefined>(undefined);
    const [zoneHash, setZoneHash] = useState<string | undefined>(undefined);

    const setZoneInfo = useCallback((name?: string, hash?: string) => {
        setZoneName(name);
        setZoneHash(hash?.substring(0, 4));
    }, []);

    // member
    const [memberName, setMemberName] = useState<string | undefined>(undefined);
    const [memberServer, setMemberServer] = useState<string | undefined>(undefined);
    const setMemberInfo = useCallback((name?: string, server?: string) => {
        setMemberName(name);
        setMemberServer(server);
    }, []);

    const value: HeaderContextType = {zoneName, zoneHash, setZoneInfo, memberName, memberServer, setMemberInfo};

    return (
        <HeaderContext.Provider value={value}>
            {children}
        </HeaderContext.Provider>
    );
};