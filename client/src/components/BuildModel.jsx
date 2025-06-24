import React, { useEffect, useState } from 'react';

export default function ModelBuilder() {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('⏳ Starting...');
    const [completedSteps, setCompletedSteps] = useState(false);
    const [apiDone, setApiDone] = useState(false);
    const [error, setError] = useState('');

    const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Generate total duration (30–45s) and distribute it across steps using weights
    const totalDuration = Math.floor(Math.random() * 15000) + 30000; // 30–45 seconds
    const weights = [1, 1, 1.2, 1.5, 1.3]; // proportional time per step
    const weightSum = weights.reduce((a, b) => a + b, 0);

    const steps = [
        { text: '⚙️ Preparing model...', delay: totalDuration * (weights[0] / weightSum) },
        { text: '📊 Validating features & target...', delay: totalDuration * (weights[1] / weightSum) },
        { text: '🧠 Analyzing dataframe...', delay: totalDuration * (weights[2] / weightSum) },
        { text: '🏗️ Building model...', delay: totalDuration * (weights[3] / weightSum) },
        { text: '📈 Finalizing metrics...', delay: totalDuration * (weights[4] / weightSum) },
    ];

    useEffect(() => {
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percent = (elapsed / totalDuration) * 100;

            setProgress(Math.min(percent, 100));
        }, 200);

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
                clearInterval(interval);
            });

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto mt-20 p-6">
            <div className="text-lg font-semibold text-center mb-4 text-chrysler-blue-700 font-montserrat">
                {error ? `❌ ${error}` : completedSteps && apiDone ? '🎉 Model Ready!' : statusText}
            </div>

            <div className="relative w-full h-6 rounded-full overflow-hidden bg-gray-300 shadow-md">
                <div
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 ease-linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="text-center mt-3 text-sm text-amethyst-700 font-montserrat">
                {Math.floor(progress)}%
            </div>
        </div>
    );
}
