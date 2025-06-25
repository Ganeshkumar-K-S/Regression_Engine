import { useEffect, useState } from 'react';
import AssumptionCard from './AssumptionCard';
import SkeletonCard from './SkeletonCard';

export default function Assumptions({ uuid, features , assumptionDone , setAssumptionDone}) {
    const [assumptionsData, setAssumptionsData] = useState(null);
    const [outlierData, setOutlierData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const assumptionTitles = {
        1: 'Linearity',
        2: 'Independence of Errors',
        3: 'Normality of Errors',
        4: 'No Perfect Multicollinearity',
        5: 'Equal Variance of Errors',
        6: 'Outliers & Influence'
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res1 = await fetch("http://localhost:5000/api/assumptions", { credentials: "include" });
                const json1 = await res1.json();
                const res2 = await fetch("http://localhost:5000/api/treat-outliers", { credentials: "include" });
                const json2 = await res2.json();
                setAssumptionsData(json1);
                setOutlierData({ result: "success", ...json2 });
                setAssumptionDone(true);
            } catch (e) {
                console.error("Failed to load assumption/outlier data", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen py-8 font-montserrat">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-chrysler-blue-600 mb-2">Loading Assumptions</h2>
                        <p className="text-amethyst-600">Analyzing your data...</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6">
                        {[...Array(6)].map((_, index) => (
                            <SkeletonCard isOutlierCase={index === 5} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!assumptionsData || !outlierData) {
        return (
            <div className="min-h-screen flex items-center justify-center font-montserrat">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-chrysler-blue-600 mb-2">Failed to Load Data</h2>
                    <p className="text-amethyst-600">Please try refreshing the page.</p>
                </div>
            </div>
        );
    }

    const allAssumptions = {
        ...assumptionsData,
        assumption_6: outlierData,
    };

    return (
        <div className="min-h-screen py-8 font-montserrat">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-chrysler-blue-600 mb-2">Statistical Assumptions Analysis</h2>
                    <p className="text-amethyst-600">Review the validation results for each assumption</p>
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                    {Object.entries(allAssumptions).map(([key, value], index) => {
                        const numberMatch = key.match(/assumption_(\d+)/);
                        const assumptionNumber = numberMatch ? parseInt(numberMatch[1]) : index + 1;
                        const title = assumptionTitles[assumptionNumber] || `Assumption ${assumptionNumber}`;

                        return (
                            <AssumptionCard
                                key={key}
                                title={title}
                                data={value}
                                assumptionNumber={assumptionNumber}
                                uuid={uuid}
                                delay={index * 200}
                                features={features}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
