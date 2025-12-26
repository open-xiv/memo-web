import { cn } from "@/lib/utils.ts";
import SearchIcon from "@/assets/icon/search.svg?react";
import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hook/use-debounce.ts";
import type { MemberSearchResult } from "@/types/member.ts";
import { searchMember } from "@/api/sumemo.ts";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge.tsx";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command.tsx";

export function HeaderSearch() {
    const navigate = useNavigate();

    const [isHover, setIsHover] = useState(false);

    const [isActive, setIsActive] = useState(false);
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);

    const [results, setResults] = useState<MemberSearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                e.preventDefault();
                setIsActive(true);
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
        void fetchResults();
    }, [debouncedQuery]);

    const handleSelect = (name: string, server: string) => {
        navigate(`/member/${name}@${server}`);
        setIsActive(false);
        setQuery("");
    };

    return (
            <>
                {/* Search Button */}
                <div
                        onClick={() => {
                            setIsActive(true);
                        }}
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                        className={cn(
                                "relative inline-flex h-10 items-center justify-center rounded-lg transition-colors duration-300 px-3",
                        )}>

                    <div
                            className={cn(
                                    "absolute inset-0 rounded-lg border blur-[2px] transition-colors duration-300",
                                    isHover
                                            ? "border-primary-border bg-primary"
                                            : "border-border bg-transparent",
                            )}
                    />

                    <div className="relative z-20 flex h-full items-center justify-center gap-x-2">
                        <WrapperIcon
                                icon={SearchIcon}
                                className={cn(
                                        "size-6 shrink-0 transition-colors duration-300",
                                )}
                                primary={isHover ? "var(--primary-ring)" : "var(--muted-foreground)"}
                                secondary={isHover ? "var(--primary-foreground)" : "var(--muted-foreground)"}
                        />
                        <Badge variant="outline" className={cn(
                                "hidden sm:block text-secondary-foreground",
                                isHover
                                        ? "border-secondary-border bg-secondary"
                                        : "border-border bg-transparent",
                        )}>/</Badge>
                    </div>

                </div>

                {/* Search Dialog */}
                <CommandDialog open={isActive} onOpenChange={setIsActive}>
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
            </>
    );
}
