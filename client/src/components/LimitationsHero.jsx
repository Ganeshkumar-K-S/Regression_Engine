import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LimitationsHero() {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="flex flex-col md:flex-row items-center justify-between min-h-[80vh] px-4 md:px-10 py-10 font-montserrat">
            {/* Left: Image */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-start mb-10 md:mb-0">
                {!imageLoaded && (
                    <Skeleton
                        height={300}
                        width={'100%'}
                        baseColor="#e2e8f0"
                        highlightColor="#f1f5f9"
                        className="rounded-xl max-w-md md:max-w-lg"
                    />
                )}
                <img
                    src="/data_scientist_.jpeg"
                    alt="Data Scientist Illustration"
                    className={`w-full max-w-md md:max-w-lg object-contain transition-opacity duration-500 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                />
            </div>

            {/* Right: Text Content */}
            <div className="w-full md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
                    ⚠ Limitations on Data Processing
                </h1>

                <ul className="text-base md:text-lg text-slate-600 list-disc pl-5 space-y-2">

                    <li>
                        <span className="font-semibold text-red-600">Time series analysis</span> cannot be performed (features are treated as categories).
                    </li>
                    <li>
                        <span className="font-semibold text-red-600">Feature engineering</span> options are not available — please ensure features are well-prepared before uploading.
                    </li>
                    <li>
                        <span className="font-semibold text-red-600">Regularized regression</span> (e.g., Ridge, Lasso) cannot be performed.
                    </li>
                    <li>
                        <span className="font-semibold text-red-600">Classification</span> is not supported — the target variable cannot be categorical.
                    </li>
                </ul>
            </div>
        </div>
    );
}
