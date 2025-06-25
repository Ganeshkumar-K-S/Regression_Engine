import { useEffect, useState, useMemo } from 'react';
import { fetchImageUrls } from '../utils/fetchImageList';

export default function AssumptionCard({ title, data, assumptionNumber, uuid, delay = 0, features }) {
    const [isVisible, setIsVisible] = useState(false);
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isSuccess = data.result === "success";

    const allFeatures = useMemo(() => [...Object.values(features), 'const'], [features]);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (images.length > 0) return;

        const loadImages = async () => {
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
        };

        loadImages();
    }, [assumptionNumber, data.features, uuid, allFeatures, images.length]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const isOutlierCase = assumptionNumber === 6;
    const hasMultiple = isOutlierCase ? images.length > 0 : images.length > 1;

    return (
        <div className={`group relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
            <div className="relative h-56 m-2.5 overflow-hidden rounded-md bg-gray-100">
                {hasMultiple ? (
                    <div className="relative h-full w-full flex items-center justify-center">
                        {isOutlierCase ? (
                            <div className="flex flex-col items-center w-full px-2">
                                <p className="text-xs text-slate-700 mb-1">
                                    Feature: {images[currentIndex].feature}
                                </p>
                                <div className="flex gap-2 h-full w-full justify-center">
                                    <img
                                        src={`data:image/jpeg;base64,${images[currentIndex].before.base64}`}
                                        alt="Before removing outliers"
                                        className="h-full w-1/2 object-contain rounded-md"
                                    />
                                    <img
                                        src={`data:image/jpeg;base64,${images[currentIndex].after.base64}`}
                                        alt="After removing outliers"
                                        className="h-full w-1/2 object-contain rounded-md"
                                    />
                                </div>
                            </div>
                        ) : (
                            <img
                                src={`data:image/jpeg;base64,${images[currentIndex].base64}`}
                                alt={`${title} image`}
                                className="h-full object-contain transition-transform group-hover:scale-105 rounded-md"
                            />
                        )}

                        <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow hover:bg-slate-100">
                            <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow hover:bg-slate-100">
                            <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <img
                        src={`data:image/jpeg;base64,${images[0]?.base64}`}
                        alt={title}
                        className="w-full h-full object-contain transition-transform group-hover:scale-105 rounded-md"
                    />
                )}

                <div className="absolute top-2 right-2 p-1 rounded-full shadow bg-white">
                    {isSuccess ? (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </div>
            </div>

            <div className="p-4 space-y-2">
                <h6 className="mb-1 text-slate-800 text-xl font-semibold">{title}</h6>
                <p className="text-slate-600 text-sm">
                    {isSuccess
                        ? "Assumption holds well. No corrective action needed."
                        : "Assumption violated. Consider transformation or alternative modeling strategies."}
                </p>

                {data.features?.length > 0 && (
                    <div>
                        <p className="font-medium text-sm text-slate-700">Involved Features:</p>
                        <ul className="list-disc pl-5 text-sm text-slate-600 max-h-24 overflow-y-auto">
                            {data.features.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                    </div>
                )}
            </div>

            <div className="px-4 pb-4 pt-0 mt-2">
                <button className="rounded-md bg-slate-800 py-2 px-4 text-sm text-white hover:scale-105 hover:bg-slate-700">
                    View Details
                </button>
            </div>
        </div>
    );
}
