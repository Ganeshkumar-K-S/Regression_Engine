import React, { useEffect, useState } from 'react';

export default function ModelBuilder() {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('⏳ Starting...');
    const [completedSteps, setCompletedSteps] = useState(false);
    const [apiDone, setApiDone] = useState(false);
    const [error, setError] = useState('');

    // Generate random durations between 30-45 seconds (30000-45000ms)
    const generateRandomDuration = () => Math.floor(Math.random() * 5000) + 30000;

    const steps = [
        { text: '⚙️ Preparing model...', delay: generateRandomDuration() },
        { text: '📊 Validating features & target...', delay: generateRandomDuration() },
        { text: '🧠 Analyzing dataframe...', delay: generateRandomDuration() },
        { text: '🏗️ Building model...', delay: generateRandomDuration() },
        { text: '📈 Finalizing metrics...', delay: generateRandomDuration() },
    ];

    const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    useEffect(() => {
        const totalDuration = steps.reduce((acc, step) => acc + step.delay, 0);
        const startTime = Date.now();
        let intervalId;

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const percent = Math.min((elapsed / totalDuration) * 100, 100);
            
            setProgress(percent);
        };

        intervalId = setInterval(updateProgress, 200);

        const runSteps = async () => {
            for (const step of steps) {
                setStatusText(step.text);
                await new Promise((res) => setTimeout(res, step.delay));
            }
            setCompletedSteps(true);
        };

        runSteps();

        fetch('http://localhost:5000/api/makemodel', {
            credentials: 'include'
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to create model');
                return res.json();
            })
            .then((data) => {
                setApiDone(true);
                setStatusText(`✅ ${capitalizeFirst(data.message || 'Model created successfully!')}`);
            })
            .catch((err) => {
                setError(err.message);
                setStatusText('❌ Error occurred while building the model');
                if (intervalId) clearInterval(intervalId);
            });

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    // Handle completion - this will trigger when both states change
    useEffect(() => {
        if (completedSteps && apiDone && !error) {
            setProgress(100);
        }
    }, [completedSteps, apiDone, error]);

    return (
        <div className="w-full max-w-6xl mx-auto mt-20 p-6">
            <div className="text-lg font-semibold text-center mb-4 text-chrysler-blue-700">
                {error ? `❌ ${error}` : completedSteps && apiDone ? '🎉 Model Ready!' : statusText}
            </div>

            <div className="relative w-full h-6 rounded-full overflow-hidden bg-gray-300 shadow-md">
                <div
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 ease-linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="text-center mt-3 text-sm text-amethyst-700">
                {Math.floor(progress)}%
            </div>
        </div>
    );
}