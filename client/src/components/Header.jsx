import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import logo from '../assets/logo.svg';
import '../index.css';

export default function Header() {
    const [logoLoaded, setLogoLoaded] = useState(false);

    return (
        <header className="relative flex items-center justify-between px-4 py-3 shadow-md bg-honeydew">
            {/* Left Logo or Skeleton */}
            <div className="flex items-center gap-3 z-10">
                {!logoLoaded && (
                    <Skeleton
                        circle
                        height={56}
                        width={56}
                        baseColor="#e0e0e0"
                        highlightColor="#f5f5f5"
                    />
                )}
                <img
                    src={logo}
                    alt="Logo"
                    onLoad={() => setLogoLoaded(true)}
                    className={`h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain transition-opacity duration-300 ${
                        logoLoaded ? 'opacity-100' : 'opacity-0 absolute'
                    }`}
                />
            </div>

            {/* Title */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
                {logoLoaded ? (
                    <h1 className="font-montserrat font-semibold text-chrysler-blue-600 text-[clamp(1.25rem,4vw,2rem)] leading-snug whitespace-nowrap">
                        Regression Engine
                    </h1>
                ) : (
                    <Skeleton height={32} width={160} baseColor="#e0e0e0" highlightColor="#f5f5f5" />
                )}
            </div>

            {/* Right Spacer */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
        </header>
    );
}
