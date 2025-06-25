import { useEffect, useState } from 'react';

// Skeleton Card Component
export default function SkeletonCard() {
    return (
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96 animate-pulse">
            {/* Image skeleton */}
            <div className="relative h-56 m-2.5 bg-slate-200 rounded-md">
                <div className="absolute top-2 right-2 w-7 h-7 bg-slate-300 rounded-full"></div>
            </div>

            {/* Body skeleton */}
            <div className="p-4 space-y-2">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
                
                {/* Features skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
            </div>

            {/* Button skeleton */}
            <div className="px-4 pb-4 pt-0 mt-2">
                <div className="h-9 bg-slate-200 rounded-md w-28"></div>
            </div>
        </div>
    );
}