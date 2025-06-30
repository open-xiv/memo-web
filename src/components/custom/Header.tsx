import {useLocation, useParams} from "react-router-dom";
import UserIcon from "@/assets/user.svg?react";
import FightIcon from "@/assets/fight.svg?react";
import {useHeaderContext} from "@/context/HeaderContext";

export default function Header() { // Remove props from function signature
    const location = useLocation();
    const params = useParams<{ name?: string; id?: string }>();
    const {zoneName, zoneHash} = useHeaderContext();

    const isMemberPage = location.pathname.startsWith("/member/");
    const memberName = isMemberPage ? params.name : null;

    const isFightPage = zoneName !== undefined || location.pathname.startsWith("/fight/");

    return (
        <header className="p-4">
            <nav className="container mx-auto flex items-center space-x-3">
                {/* Home */}
                {/*<div className="w-10 h-10 relative flex items-center justify-center">*/}
                {/*    <div className="w-full h-full absolute bg-pink-50 rounded-lg border border-pink-300 blur-[2px] z-10"/>*/}
                {/*    <Link to="/" className="hover:text-primary transition-colors z-20">*/}
                {/*        <HomeIcon className="h-6 w-6"/>*/}
                {/*    </Link>*/}
                {/*</div>*/}

                {/* Member */}
                <div className={`h-10 relative flex items-center ${isMemberPage ? "justify-start" : "w-10 justify-center"}`}>
                    <div className="w-full h-full absolute bg-violet-50 rounded-lg border border-violet-300 blur-[2px] z-10"/>
                    <div className={`relative flex items-center h-full z-20 ${isMemberPage ? "justify-start ml-3 mr-4 gap-2" : "w-full justify-center"}`}>
                        <UserIcon className="h-6 w-6"/>
                        {isMemberPage ? (
                            <div className="flex justify-start items-baseline gap-1 text-violet-950">
                                <div>
                                    <span className="text-base font-medium">{memberName!.split("@")[0]}</span>
                                    <span className="text-sm font-medium"> </span>
                                </div>
                                <span className="text-xs font-normal">{memberName!.split("@")[1]}</span>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Fight */}
                <div className={`h-10 relative flex items-center ${isFightPage ? "justify-start" : "w-10 justify-center"}`}>
                    <div className="w-full h-full absolute bg-teal-50 rounded-lg border border-teal-300 blur-[2px] z-10"/>
                    <div className={`relative flex items-center h-full z-20 ${isFightPage ? "justify-start ml-3 mr-4 gap-2" : "w-full justify-center"}`}>
                        <FightIcon className="h-6 w-6"/>
                        {isFightPage ? (
                            <div className="flex justify-start items-baseline gap-1 text-teal-950">
                                <div>
                                    <span className="text-base font-medium">{zoneName || "Zone"}</span>
                                    <span className="text-sm font-medium"> </span>
                                </div>
                                <span className="text-xs font-normal">{zoneHash !== undefined ? `#${zoneHash}` : ""}</span>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Search */}
                {/*<div className={`h-10 relative flex items-center ${"w-10 justify-center"}`}>*/}
                {/*    <div className="w-full h-full absolute bg-amber-50 rounded-lg border border-amber-300 blur-[2px] z-10"/>*/}
                {/*    <div className={`relative flex items-center h-full z-20 ${"w-full justify-center"}`}>*/}
                {/*        <SearchIcon className="h-6 w-6"/>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </nav>
        </header>
    );
}

