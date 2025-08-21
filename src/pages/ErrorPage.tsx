import ErrIcon from "@/assets/icon/error.svg?react";
import Icon from "@/components/custom/Icon.tsx";

export default function ErrorPage() {
    return (
        <div className="flex flex-col gap-4 p-4">
            {/* Error Notice */}
            <div className="w-full relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-red-50 rounded-lg border border-red-300 blur-[2px] z-10" />
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <Icon icon={ErrIcon} className={`h-6 w-6`} primary={`var(--color-red-400)`} secondary={`var(--color-red-950)`} />
                    <span className="text-red-950 text-base font-medium"> 不存在的页面 </span>
                    <span className="text-red-600 text-base font-medium"> 可能是被我家猫猫吃了 </span>
                </div>
            </div>
        </div>
    );
}
