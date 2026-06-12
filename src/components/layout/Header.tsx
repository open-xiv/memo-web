import ToggleTheme from '@/components/custom/toggle/ToggleTheme.tsx';
import { HeaderMember } from '@/components/custom/header/HeaderMember.tsx';
import { HeaderSearch } from '@/components/custom/header/HeaderSearch.tsx';
import { HeaderHelp } from '@/components/custom/header/HeaderHelp.tsx';
import { HeaderLeaderboard } from '@/components/custom/header/HeaderLeaderboard.tsx';
import { HeaderIcon } from '@/components/custom/header/HeaderIcon.tsx';

export default function Header() {
    return (
        <header className="m-4 mt-8">
            <nav className="mx-auto container flex items-center space-x-3">
                {/* SuMemo Icon */}
                <div className="hidden sm:block">
                    <HeaderIcon />
                </div>

                {/* Member */}
                <HeaderMember />

                {/* Search */}
                <HeaderSearch />

                {/* Theme Toggle  */}
                <div className="ml-auto">
                    <ToggleTheme />
                </div>

                {/* Leaderboard — kept visible on mobile too, since it's the only entry point */}
                <HeaderLeaderboard />

                {/* Help */}
                <div className="hidden sm:block">
                    <HeaderHelp />
                </div>
            </nav>
        </header>
    );
}
