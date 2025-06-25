import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function SkeletonCard({ isOutlierCase = false }) {
    return (
        <div className="group relative flex flex-col my-6 bg-white border border-slate-200 rounded-2xl w-[620px] shadow-lg font-montserrat">
            {/* Title + Success Icon */}
            <div className="px-6 pt-6 pb-3 flex items-center justify-between">
                {/* Title skeleton */}
                <div className="w-[240px]">
                    <Skeleton height={28} borderRadius={8} />
                </div>

                {/* Icon skeleton */}
                <Skeleton circle height={24} width={24} />
            </div>


            {/* Image Section */}
            <div className="relative h-[380px] mx-6 mb-6 overflow-hidden rounded-xl bg-slate-50 shadow-inner">
                {isOutlierCase ? (
                    <div className="flex flex-col items-center w-full h-full relative">
                        {/* Feature Pill */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 px-4 py-1 rounded-full shadow w-40 h-6">
                            <Skeleton height={24} />
                        </div>

                        <div className="flex justify-center items-center w-full h-full gap-4 px-4 mt-6">
                            {[1, 2].map((_, idx) => (
                                <div
                                    key={idx}
                                    className="w-1/2 h-[280px] rounded-lg overflow-hidden bg-white border border-slate-200 shadow-md flex flex-col"
                                >
                                    <Skeleton height="100%" width="100%" />
                                    <div className="w-full text-center text-xs py-1 bg-white/90 text-slate-400 font-semibold">
                                        <Skeleton height={12} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <Skeleton height="100%" width="100%" />
                )}
            </div>

            {/* Description */}
            <div className="px-6 pb-6 space-y-2">
                <Skeleton height={16} width="75%" />
                <Skeleton height={16} width="50%" />
            </div>
        </div>
    );
}
