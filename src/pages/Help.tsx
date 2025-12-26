export default function Help() {
    return (
            <div className="flex flex-col gap-4">

                {/* Q1 */}
                <div className="w-full relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-category rounded-lg border border-category-border blur-[2px] z-10" />
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        {/*<PinIcon className="size-6"/>*/}
                        <div className={`ml-2 flex flex-wrap gap-x-2 gap-y-1 items-baseline`}>
                            <span className="text-category-foreground font-medium">关于数据</span>
                            <span className="text-category-ring font-medium text-xs uppercase">Q#1</span>
                        </div>
                    </div>
                </div>
                <div className="mx-4 w-11/12 relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-card rounded-lg border border-card-border blur-[2px] z-10" />
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        <div className={`ml-2 flex flex-col gap-y-2.5 text-card-foreground`}>
                            <p>
                                同诸如 <span className="text-category-ring">艾欧泽亚售楼中心</span>、<span
                                    className="text-category-ring">Universalis</span> 等玩家自行维护的网站类似，本站数据均来自玩家上报，本站不对数据负责。
                            </p>
                            <p>
                                本站统计数据精确度取决于玩家上报频率，频率过低时可能会出现较大误差。
                            </p>
                            <p>
                                因此数据 <span className="font-semibold text-destructive-ring">不能</span> 被视作为绝对正确的进度，请同时参考其他来源，例如 <span
                                    className="text-category-ring">FFLogs</span> 。
                            </p>
                            <p>
                                与具有排名性质的统计相比，我们更希望优化各位自由组队时的攻略体验。
                            </p>
                            <p className={`font-medium text-zone-ring`}>无论如何统计，都不如真诚沟通更有意义。</p>
                        </div>
                    </div>
                </div>

                {/* Q2 */}
                <div className="w-full relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-category rounded-lg border border-category-border blur-[2px] z-10" />
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        {/*<PinIcon className="size-6"/>*/}
                        <div className={`ml-2 flex flex-wrap gap-x-2 gap-y-1 items-baseline`}>
                            <span className="text-category-foreground font-medium">关于同步</span>
                            <span className="text-category-ring font-medium text-xs uppercase">Q#2</span>
                        </div>
                    </div>
                </div>
                <div className="mx-4 w-11/12 relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-card rounded-lg border border-card-border blur-[2px] z-10" />
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        <div className={`ml-2 flex flex-col gap-y-2.5 text-card-foreground`}>
                            <p>
                                在获取进度时，我们会尝试与 <span className="text-category-ring">FFLogs</span> 中 <span
                                    className={`text-zone-foreground`}>已通关</span> 的报告进行关联。
                            </p>
                            <p>
                                由于其存在的速率限制，这种关联可能需要 <span className="text-category-ring">一小时或者更多的时间</span> 来完成。
                            </p>
                        </div>
                    </div>
                </div>

                {/* Q3 */}
                <div className="w-full relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-category rounded-lg border border-category-border blur-[2px] z-10" />
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        {/*<PinIcon className="size-6"/>*/}
                        <div className={`ml-2 flex flex-wrap gap-x-2 gap-y-1 items-baseline`}>
                            <span className="text-category-foreground font-medium">关于接口</span>
                            <span className="text-category-ring font-medium text-xs uppercase">Q#3</span>
                        </div>
                    </div>
                </div>
                <div className="mx-4 w-11/12 relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-card rounded-lg border border-card-border blur-[2px] z-10" />
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        <div className={`ml-2 flex flex-col gap-y-2.5 text-card-foreground`}>
                            <p>
                                我们允许使用网页中已经暴露的接口来获取数据。
                            </p>
                            <p>
                                请勿滥用或频繁请求数据，这会对服务器造成负担。
                            </p>
                            <p>
                                本项目完全 <span className="text-category-ring">用爱发电</span>，因此请不要将其用于商业用途。
                            </p>
                            <p className={`font-medium text-secondary-ring`}>
                                由于仍处于早期开发阶段，接口可能会发生变化。
                            </p>
                        </div>
                    </div>
                </div>

                {/* Q4 */}
                <div className="w-full relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-category rounded-lg border border-category-border blur-[2px] z-10" />
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        {/*<PinIcon className="size-6"/>*/}
                        <div className={`ml-2 flex flex-wrap gap-x-2 gap-y-1 items-baseline`}>
                            <span className="text-category-foreground font-medium">关于隐私</span>
                            <span className="text-category-ring font-medium text-xs uppercase">Q#4</span>
                        </div>
                    </div>
                </div>
                <div className="mx-4 w-11/12 relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-card rounded-lg border border-card-border blur-[2px] z-10" />
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        <div className={`ml-2 flex flex-col gap-y-2.5 text-card-foreground`}>
                            <p>
                                和 <span className="text-category-ring">FFLogs</span> 相同，我们理解在某些情况下，玩家可能不希望其数据被公开。
                            </p>
                            <p>
                                为了验证角色所属，玩家需要通过 <span className="text-category-ring">Discord</span> 频道来调整数据的展示策略。
                            </p>
                            <p className={`font-medium text-zone-ring`}>
                                无论数据是否显示，都不应该影响彼此之间的交流和理解。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
    );
}