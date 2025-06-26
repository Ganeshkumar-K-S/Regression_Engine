import { useEffect, useState, useMemo } from 'react';
import { fetchImageUrls } from '../utils/fetchImageList';

export default function AssumptionCard({ title, data, assumptionNumber, uuid, delay = 0, features }) {
    const [isVisible, setIsVisible] = useState(false);
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isSuccess = data.result === "success";

    const isOutlierCase = assumptionNumber === 6;
    const allFeatures = useMemo(() => [...Object.values(features), 'const'], [features]);

    // Fallback image path
    const fallbackImagePath = '../../public/no_image_found.jpg';

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (images.length > 0) return;

        const loadImages = async () => {
            try {
                if (assumptionNumber === 1 && data.features) {
                    const imageData = await fetchImageUrls('assumption_1', uuid, allFeatures);
                    setImages(imageData);
                } else if (assumptionNumber === 6 && allFeatures.length > 0) {
                    const before = await fetchImageUrls('before_removing_outliers', uuid, allFeatures);
                    const after = await fetchImageUrls('after_removing_outliers', uuid, allFeatures);
                    const paired = [];

                    for (let i = 0; i < before.length; i++) {
                        paired.push({ before: before[i], after: after[i], feature: allFeatures[i] });
                    }
                    setImages(paired);
                } else {
                    const imageData = await fetchImageUrls(`assumption_${assumptionNumber}`, uuid, ['']);
                    setImages(imageData);
                }
            } catch (error) {
                console.error('Error loading images:', error);
                // Images will remain empty array, triggering fallback
            }
        };

        loadImages();
    }, [assumptionNumber, data.features, uuid, allFeatures, images.length]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const showArrows = images.length > 1;
    const hasImages = images.length > 0;

    return (
        <div
            className={`group relative flex flex-col my-6 bg-white border border-slate-200 rounded-2xl w-[620px] transition-all duration-500 font-montserrat shadow-lg hover:shadow-2xl hover:scale-[1.01] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
            {/* Title + Success Icon */}
            <div className="px-6 pt-6 pb-3 flex items-center justify-between">
                <h6 className="text-2xl font-semibold text-chrysler-blue-600">{title}</h6>
                <div className="p-2 rounded-full shadow bg-white">
                    {isSuccess ? (
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Image Section */}
            <div className="relative h-[380px] mx-6 mb-6 overflow-hidden rounded-xl bg-slate-50 shadow-inner">
                {!hasImages ? (
                    // Fallback image when no images are found
                    <div className="flex items-center justify-center w-full h-full">
                        <img
                            src={fallbackImagePath}
                            alt="No image found"
                            className="w-full h-full object-contain opacity-70"
                        />
                    </div>
                ) : isOutlierCase ? (
                    <div className="flex flex-col items-center w-full h-full relative">
                        {/* Feature Pill */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 px-4 py-1 rounded-full text-sm font-medium bg-white text-amethyst-500 shadow">
                            Feature: {images[currentIndex]?.feature}
                        </div>

                        <div className="flex justify-center items-center w-full h-full gap-4 px-4 mt-6">
                            {['before', 'after'].map((type) => (
                                <div
                                    key={type}
                                    className="relative group w-1/2 h-[280px] rounded-lg overflow-hidden border border-slate-200 bg-white shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105"
                                >
                                    <img
                                        src={`data:image/jpeg;base64,${images[currentIndex]?.[type]?.base64}`}
                                        alt={`${type} image`}
                                        className="w-full h-full object-contain transition-opacity duration-300"
                                    />
                                    <div className="absolute bottom-0 w-full text-center text-xs bg-white/90 py-1 font-semibold text-slate-600">
                                        {type === 'before' ? 'Before Outlier Treatment' : 'After Outlier Treatment'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {showArrows && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-amethyst-300"
                                >
                                    <svg className="w-5 h-5 text-amethyst-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-amethyst-300"
                                >
                                    <svg className="w-5 h-5 text-amethyst-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <img
                            src={`data:image/jpeg;base64,${images[currentIndex]?.base64}`}
                            alt={`${title} image`}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        {showArrows && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-amethyst-300"
                                >
                                    <svg className="w-5 h-5 text-amethyst-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-amethyst-300"
                                >
                                    <svg className="w-5 h-5 text-amethyst-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Description Section */}
            <div className="px-6 pb-6 text-sm text-amethyst-600">
                {isSuccess
                    ? "Assumption holds well. No corrective action needed."
                    : "Assumption violated. Consider transformation or alternative modeling strategies."}
            </div>
        </div>
    );
}