import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import UserIcon from "@/assets/icon/user.svg?react";
import SearchIcon from "@/assets/icon/search.svg?react";
import {Input} from "@/components/ui/input.tsx";
import type {KeyboardEvent} from "react";
import {useEffect, useRef, useState} from "react";
import {Badge} from "@/components/ui/badge.tsx";
import HelpIcon from "@/assets/icon/help.svg?react";
import Icon from "@/components/custom/Icon.tsx";
import ThemeToggle from "@/components/custom/ThemeToggle.tsx";
import {useTheme} from "@/context/ThemeContext.ts";

export default function Header() {
    const {theme} = useTheme();

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
        <header className="m-4 mt-8">
            <nav className="mx-auto container flex items-center space-x-3">

                {/* Member */}
                <div className={`h-10 relative inline-flex items-center justify-start`}>
                    <div className={`w-full h-full absolute bg-violet-50 dark:bg-violet-950 rounded-lg border border-violet-300 dark:border-violet-700 blur-[2px] z-10`}/>
                    <div className={`relative flex items-center h-full z-20 m-3 justify-start ${isMemberPage ? "gap-2" : ""}`}>
                        <Icon
                            icon={UserIcon}
                            className={`h-6 w-6 shrink-0`}
                            primary={`var(${theme !== "dark" ? "--color-violet-600" : "--color-violet-400"})`}
                            secondary={`var(${theme !== "dark" ? "--color-violet-950" : "--color-violet-200"})`}
                        />
                        <div className={`
                    flex justify-start items-baseline gap-1 text-violet-950 dark:text-violet-200
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
                    <div className={`w-full h-full absolute bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-300 dark:border-amber-700 blur-[2px] z-10`}/>
                    <div className={`relative flex items-center h-full z-20 m-3 justify-start gap-2`}>
                        <Icon
                            icon={SearchIcon}
                            className={`h-6 w-6 shrink-0 cursor-pointer`}
                            primary={`var(${theme !== "dark" ? "--color-amber-500" : "--color-amber-400"})`}
                            secondary={`var(${theme !== "dark" ? "--color-amber-950" : "--color-amber-200"})`}
                            onClick={() => setIsSearching(!isSearching)}
                        />
                        {!isSearching &&
                            <Badge variant="outline" className="bg-amber-100 dark:bg-amber-800 border-amber-300 dark:border-amber-600 text-amber-950 dark:text-amber-200">/</Badge>}
                        <div className={`
                    flex justify-start items-baseline gap-1 text-amber-950 dark:text-amber-200
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
                                h-7 text-base font-medium
                                bg-amber-100 dark:bg-amber-900
                                border-amber-300 dark:border-amber-700
                                text-amber-950 dark:text-amber-200
                                focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none
                                focus-visible:border-amber-500 dark:focus-visible:border-amber-400
                            `}
                                    placeholder="吉田直树@宇宙和音"
                                />
                                {isSearchValid && (
                                    <Badge variant="outline"
                                           className="cursor-pointer bg-amber-100 dark:bg-amber-800 border-amber-300 dark:border-amber-600 text-amber-950 dark:text-amber-200"
                                           onClick={handleSearch}>↵</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Theme Toggle  */}
                <ThemeToggle/>

                {/* Help */}
                <Link to={"/help"} className={`hidden sm:inline-flex w-10 h-10 relative items-center justify-center`}>
                    <div className={`w-full h-full absolute bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-400 dark:border-zinc-600 blur-[2px] z-10`}/>
                    <div className={`relative flex items-center h-full z-20 justify-center`}>
                        <Icon
                            icon={HelpIcon}
                            className={`h-6 w-6 shrink-0`}
                            primary={`var(${theme !== "dark" ? "--color-gray-900" : "--color-gray-200"})`}
                            secondary={`var(${theme !== "dark" ? "--color-gray-200" : "--color-gray-800"})`}
                        />
                    </div>
                </Link>
            </nav>
        </header>
    );
}