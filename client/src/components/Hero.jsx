import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function RegressionEngineHero() {
    const words = ['Predict', 'Analyze', 'Model', 'Optimize', 'Visualize'];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [showCursor, setShowCursor] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const currentWord = words[currentWordIndex];

        if (isTyping) {
            if (currentText.length < currentWord.length) {
                const timeout = setTimeout(() => {
                    setCurrentText(currentWord.slice(0, currentText.length + 1));
                }, 150);
                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => {
                    setIsTyping(false);
                }, 2000);
                return () => clearTimeout(timeout);
            }
        } else {
            if (currentText.length > 0) {
                const timeout = setTimeout(() => {
                    setCurrentText(currentText.slice(0, -1));
                }, 100);
                return () => clearTimeout(timeout);
            } else {
                setCurrentWordIndex((prev) => (prev + 1) % words.length);
                setIsTyping(true);
            }
        }
    }, [currentText, isTyping, currentWordIndex]);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <div className="flex flex-col-reverse md:flex-row items-center justify-between min-h-[80vh] px-4 md:px-10 py-10">
            {/* Left Content */}
            <div className="w-full md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold font-montserrat bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Regression Engine
                </h1>

                <div className="text-2xl md:text-4xl font-semibold font-montserrat h-20 flex items-center">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {currentText}
                    </span>
                    <span
                        className={`inline-block w-1 h-10 md:h-12 bg-chrysler-blue ml-2 ${
                            showCursor ? 'opacity-100' : 'opacity-0'
                        } transition-opacity duration-100`}
                    />
                </div>
            </div>

            {/* Right Image with Skeleton */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end mb-8 md:mb-0">
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
                    src="/data_scientist.avif"
                    alt="Data Scientist Illustration"
                    className={`w-full max-w-md md:max-w-lg object-contain transition-opacity duration-500 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                />
            </div>
        </div>
    );
}
