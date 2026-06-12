import { BarAnalysis } from '@/components/custom/bar/BarAnalysis.tsx';
import { Leaderboard } from '@/components/custom/fight/layout/Leaderboard.tsx';

const FEATURED_ZONE_ID = 1363;

export default function LeaderboardPage() {
    return (
        <div className="flex flex-col gap-4">
            {/* Leaderboard */}
            <BarAnalysis message={`进度排名`} detail={`妖星乱舞绝境战`}></BarAnalysis>
            <div className="mx-4 w-11/12">
                <Leaderboard zoneID={FEATURED_ZONE_ID} limit={100} />
            </div>
        </div>
    );
}
