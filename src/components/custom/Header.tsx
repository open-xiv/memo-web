import {useLocation, useNavigate, useParams} from "react-router-dom";
import UserIcon from "@/assets/user.svg?react";
import SearchIcon from "@/assets/search.svg?react";
import {Input} from "@/components/ui/input.tsx";
import type {KeyboardEvent} from "react";
import {useEffect, useRef, useState} from "react";
import {Badge} from "@/components/ui/badge.tsx";

export default function Header() {
    const location = useLocation();
    const params = useParams<{ name?: string; id?: string }>();
    const navigate = useNavigate();

    const isMemberPage = location.pathname.startsWith("/member/");
    const memberName = isMemberPage ? params.name : null;

    const [isSearching, setIsSearching] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const isSearchValid = /.+@.+/.test(searchValue);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                e.preventDefault();
                setIsSearching(true);
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 0);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: globalThis.MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsSearching(false);
            }
        };

        const handleEscapeKey = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsSearching(false);
            }
        };

        if (isSearching) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscapeKey);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [isSearching]);

    const handleSearch = () => {
        if (isSearchValid) {
            navigate(`/member/${searchValue}`);
            setIsSearching(false);
            setSearchValue("");
            inputRef.current?.blur();
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <header className="p-4">
            <nav className="container mx-auto flex items-center space-x-3">

                {/* Member */}
                <div className={`h-10 relative inline-flex items-center justify-start`}>
                    <div className={`w-full h-full absolute bg-violet-50 rounded-lg border border-violet-300 blur-[2px] z-10`}/>
                    <div className={`relative flex items-center h-full z-20 m-3 justify-start ${isMemberPage ? "gap-2" : ""}`}>
                        <UserIcon className={`h-6 w-6 shrink-0`}/>
                        <div className={`
                            flex justify-start items-baseline gap-1 text-violet-950
                            transition-all duration-300 ease-in-out
                            ${isMemberPage ? "max-w-xs opacity-100" : "max-w-0 opacity-0"}
                            overflow-hidden
                        `}>{memberName && (
                            <>
                                <div>
                                    <span className={`text-base font-medium whitespace-nowrap`}>{memberName.split("@")[0]}</span>
                                    <span className={`text-sm font-medium`}> </span>
                                </div>
                                <span className={`text-xs font-normal whitespace-nowrap`}>{`@${memberName.split("@")[1]}`}</span>
                            </>
                        )}
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div ref={searchContainerRef} className={`h-10 relative inline-flex items-center justify-start`}>
                    <div className={`w-full h-full absolute bg-amber-50 rounded-lg border border-amber-300 blur-[2px] z-10`}/>
                    <div className={`relative flex items-center h-full z-20 m-3 justify-start gap-2`}>
                        <SearchIcon className={`h-6 w-6 shrink-0 cursor-pointer`} onClick={() => setIsSearching(!isSearching)}/>
                        {!isSearching && <Badge variant="outline" className="bg-amber-100 border-amber-300 text-amber-950">/</Badge>}
                        <div className={`
                            flex justify-start items-baseline gap-1 text-amber-950
                            transition-all duration-300 ease-in-out
                            ${isSearching ? "max-w-xs opacity-100" : "max-w-0 opacity-0"}
                            overflow-hidden
                        `}>
                            <div className="flex w-full max-w-sm items-center gap-1">
                                <Input
                                    ref={inputRef}
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className={`
                                        h-7 text-base font-medium bg-amber-100 border-amber-300 text-amber-950
                                        focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none
                                        focus-visible:border-amber-500
                                    `}
                                    placeholder="吉田直树@宇宙和音"
                                />
                                {isSearchValid && (
                                    <Badge variant="outline" className="cursor-pointer bg-amber-100 border-amber-300 text-amber-950" onClick={handleSearch}>↵</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Heart */}
                {/*<div className={`h-10 relative inline-flex items-center justify-start`}>*/}
                {/*    <div className={`w-full h-full absolute bg-pink-50 rounded-lg border border-pink-300 blur-[2px] z-10`}/>*/}
                {/*    <div className={`relative flex items-center h-full z-20 m-3 justify-start gap-2`}>*/}
                {/*        <HeartIcon className={`h-6 w-6 shrink-0`}/>*/}
                {/*        <div>*/}
                {/*            <span className={`text-xs whitespace-nowrap`}>from</span>*/}
                {/*            <span className={`font-medium whitespace-nowrap`}> 酥 </span>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </nav>
        </header>
    );
}