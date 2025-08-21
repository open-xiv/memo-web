import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import UserIcon from "@/assets/icon/user.svg?react";
import SearchIcon from "@/assets/icon/search.svg?react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import HelpIcon from "@/assets/icon/help.svg?react";
import HomeIcon from "@/assets/icon/home.svg?react";
import Icon from "@/components/custom/Icon.tsx";
import ThemeToggle from "@/components/custom/ThemeToggle.tsx";
import { useTheme } from "@/context/ThemeContext.ts";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command.tsx";
import { searchMember } from "@/api/sumemo.ts";
import type { MemberSearchResult } from "@/types/member.ts";
import { useDebounce } from "@/hook/use-debounce.ts";

export default function Header() {
    const { theme } = useTheme();
    const location = useLocation();
    const params = useParams<{ name?: string; id?: string }>();
    const navigate = useNavigate();

    const isMemberPage = location.pathname.startsWith("/member/");
    const memberName = isMemberPage ? params.name : null;

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);
    const [results, setResults] = useState<MemberSearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                e.preventDefault();
                setOpen(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length > 0) {
                setLoading(true);
                const searchResults = await searchMember(debouncedQuery);
                setResults(searchResults);
                setLoading(false);
            } else {
                setResults([]);
            }
        };
        fetchResults();
    }, [debouncedQuery]);

    const handleSelect = (name: string, server: string) => {
        navigate(`/member/${name}@${server}`);
        setOpen(false);
        setQuery("");
    };

    return (
        <header className="m-4 mt-8">
            <nav className="mx-auto container flex items-center space-x-3">

                {/* Home */}
                <Link to={"/"} className={`hidden sm:inline-flex w-10 h-10 relative items-center justify-center`}>
                    <div className={`w-full h-full absolute bg-pink-50 dark:bg-pink-950 rounded-lg border border-pink-300 dark:border-pink-600 blur-[2px] z-10`} />
                    <div className={`relative flex items-center h-full z-20 justify-center`}>
                        <Icon
                            icon={HomeIcon}
                            className={`h-6 w-6 shrink-0`}
                            primary={`var(${theme !== "dark" ? "--color-pink-200" : "--color-pink-900"})`}
                            secondary={`var(${theme !== "dark" ? "--color-pink-900" : "--color-pink-200"})`}
                        />
                    </div>
                </Link>

                {/* Member */}
                <div className={`h-10 relative inline-flex items-center justify-start`}>
                    <div className={`w-full h-full absolute bg-violet-50 dark:bg-violet-950 rounded-lg border border-violet-300 dark:border-violet-700 blur-[2px] z-10`} />
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
                                <span className={`text-xs font-normal whitespace-nowrap`}>{`${memberName.split("@")[1]}`}</span>
                            </>
                        )}
                        </div>
                    </div>
                </div>

                {/* Search Button */}
                <div className={`h-10 relative inline-flex items-center justify-start cursor-pointer`} onClick={() => setOpen(true)}>
                    <div className={`w-full h-full absolute bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-300 dark:border-amber-700 blur-[2px] z-10`} />
                    <div className={`relative flex items-center h-full z-20 m-3 justify-start gap-2`}>
                        <Icon
                            icon={SearchIcon}
                            className={`h-6 w-6 shrink-0`}
                            primary={`var(${theme !== "dark" ? "--color-amber-500" : "--color-amber-400"})`}
                            secondary={`var(${theme !== "dark" ? "--color-amber-950" : "--color-amber-200"})`}
                        />
                        <Badge variant="outline"
                               className="hidden sm:block bg-amber-100 dark:bg-amber-800 border-amber-300 dark:border-amber-600 text-amber-950 dark:text-amber-200">
                            /
                        </Badge>
                    </div>
                </div>

                {/* Search Dialog */}
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput
                        placeholder="搜索名称"
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        {loading && <CommandEmpty>加载中</CommandEmpty>}
                        {!loading && !results.length && debouncedQuery.length > 0 && <CommandEmpty>未找到结果</CommandEmpty>}
                        {query.length > 0 &&
                            <CommandGroup heading={"搜索结果"}>
                                {results.map((result) => (
                                    <CommandItem
                                        key={`${result.name}@${result.server}`}
                                        onSelect={() => handleSelect(result.name, result.server)}
                                        value={`${result.name} ${result.server}`}
                                        className={`flex items-baseline m-2`}
                                    >
                                        <span className={`ml-2`}>{result.name}</span>
                                        <span className="text-muted-foreground text-xs">{result.server}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        }
                        {query.length > 0 && <CommandSeparator />}
                        <CommandGroup heading={"快捷操作"}>
                            <CommandItem className={`flex items-baseline m-2 text-xs`}>
                                <span className={`ml-2`}>打开搜索</span>
                                <CommandShortcut>
                                    <kbd
                                        className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                                        <span className="text-xs">/</span>
                                    </kbd></CommandShortcut>
                            </CommandItem>
                            <CommandItem className={`flex items-baseline m-2 text-xs`}>
                                <span className={`ml-2`}>关闭搜索</span>
                                <CommandShortcut>
                                    <kbd
                                        className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                                        <span className="text-xs">Esc</span>
                                    </kbd></CommandShortcut>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>

                {/* Theme Toggle  */}
                <div className={`block`}>
                    <ThemeToggle />
                </div>

                {/* Help */}
                <Link to={"/help"} className={`hidden sm:inline-flex w-10 h-10 relative items-center justify-center`}>
                    <div className={`w-full h-full absolute bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-400 dark:border-zinc-600 blur-[2px] z-10`} />
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