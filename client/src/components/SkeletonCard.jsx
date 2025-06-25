import React from 'react';

export default function SkeletonCard() {
    return (
        <div className="group relative flex flex-col my-6 bg-white border border-slate-200 rounded-2xl w-[620px] shadow-lg animate-pulse font-montserrat">
            {/* Header Skeleton */}
            <div className="px-6 pt-6 pb-3 flex items-center justify-between">
                <div className="h-6 w-1/3 bg-slate-200 rounded"></div>
                <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
            </div>

            {/* Image + Label Section */}
            <div className="relative h-[380px] mx-6 mb-6 overflow-hidden rounded-xl bg-slate-50 shadow-inner">
                {/* Feature Pill */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm bg-white shadow w-40 h-6">
                    {/* Feature label placeholder */}
                </div>

                <div className="flex justify-center items-center w-full h-full gap-4 px-4 mt-6">
                    {[1, 2].map((_, idx) => (
                        <div
                            key={idx}
                            className="w-1/2 h-[280px] rounded-lg overflow-hidden bg-white border border-slate-200 shadow-md"
                        >
                            <div className="w-full h-full bg-slate-200"></div>
                            <div className="w-full text-center text-xs py-1 bg-white/90 text-slate-400 font-semibold">
                                {/* Caption placeholder */}
                                <div className="w-3/4 h-3 mx-auto bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Description Skeleton */}
            <div className="px-6 pb-6">
                <div className="h-4 w-3/4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
            </div>
        </div>
    );
}
