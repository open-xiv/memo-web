import type {ReactNode} from "react";
import {useCallback, useState} from "react";
import {HeaderContext, type HeaderContextType} from "@/context/HeaderContext.ts";

const DEFAULT_TITLE = "酥卷";
const DEFAULT_EN_TITLE = "SuMemo";

export const HeaderProvider = ({children}: { children: ReactNode }) => {
    // zone
    const [zoneName, setZoneName] = useState<string | undefined>(undefined);
    const [zoneHash, setZoneHash] = useState<string | undefined>(undefined);

    const setZoneInfo = useCallback((name?: string, hash?: string) => {
        setZoneName(name);
        setZoneHash(hash?.substring(0, 4));
        if (name) {
            document.title = `${DEFAULT_TITLE} - ${name}`;
        } else {
            document.title = `${DEFAULT_TITLE} - ${DEFAULT_EN_TITLE}`;
        }
    }, []);

    // member
    const [memberName, setMemberName] = useState<string | undefined>(undefined);
    const [memberServer, setMemberServer] = useState<string | undefined>(undefined);
    const setMemberInfo = useCallback((name?: string, server?: string) => {
        setMemberName(name);
        setMemberServer(server);
        if (name && server) {
            document.title = `${DEFAULT_TITLE} - ${name}`;
        } else if (zoneName) {
            document.title = `${DEFAULT_TITLE} - ${zoneName}`;
        } else {
            document.title = `${DEFAULT_TITLE} - ${DEFAULT_EN_TITLE}`;
        }
    }, [zoneName]);

    const value: HeaderContextType = {zoneName, zoneHash, setZoneInfo, memberName, memberServer, setMemberInfo};

    return (
        <HeaderContext.Provider value={value}>
            {children}
        </HeaderContext.Provider>
    );
};