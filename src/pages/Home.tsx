import DevIcon from "@/assets/dev.svg?react";

export default function Home() {
    return (
        <div className="flex flex-col gap-4">
            {/* Dev Notice */}
            <div className="w-full relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-amber-50 rounded-lg border border-amber-300 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <DevIcon className="h-6 w-6"/>
                    <div className={`flex flex-wrap gap-x-2 gap-y-1`}>
                        <span className="text-amber-950 text-base font-medium"> 正在开发中的界面 </span>
                        <span className="text-amber-600 text-base font-medium"> 产能不做是这样的 </span>
                    </div>
                </div>
            </div>
        </div>
    );
}