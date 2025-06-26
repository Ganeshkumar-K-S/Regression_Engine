import React, { useEffect, useState } from 'react';

const steps = [
    {
        title: 'Preparing for Modeling',
        description:
            'The first step in building a linear regression model is preparing your data so it can be effectively used by the algorithm. This includes ensuring your dataset is organized as a single clean table without missing (null) values. One of the most critical steps here is data splitting, where the dataset is divided into training, validation, and test sets. This allows us to evaluate how well the model performs on unseen data later in the process.',
    },
    {
        title: 'Applying Algorithms',
        description:
            'Once the data is prepared, we apply the linear regression algorithm to the training data. Linear regression assumes a linear relationship between the input features and the target variable, and the model learns the best-fitting line by minimizing the error between predicted and actual values. At this stage, the primary focus is on training the model using only the training portion of the data.',
    },
    {
        title: 'Model Evaluation',
        description:
            'After training, the model is evaluated to understand how well it fits the data. This involves checking performance on both the training and validation sets using metrics such as R-squared and Mean Absolute Error (MAE). Additionally, it is important to verify that the assumptions of linear regression—such as linearity, normality of residuals, and homoscedasticity—are not violated. A strong validation performance indicates that the model generalizes well to new data.',
    },
    {
        title: 'Model Selection',
        description:
            'In the final step, we select the best model based on its performance. Test performance is assessed using the previously unseen test set to ensure that the model\'s evaluation is unbiased. To further confirm model robustness and reduce variability, we apply K-Fold Cross-Validation, which partitions the data into multiple folds and trains/evaluates the model across different splits. This helps ensure the model is reliable and performs consistently across different subsets of data.',
    },
];

// Skeleton Loader
function SkeletonCard({ isLast }) {
    return (
        <React.Fragment>
            <div className="relative w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 bg-gray-300 w-10 h-10 flex items-center justify-center rounded-full shadow" />
                <div className="h-5 w-2/3 bg-gray-300 mx-auto mb-4 rounded" />
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
            </div>
            {!isLast && <ArrowDownSVG />}
        </React.Fragment>
    );
}

// Custom arrow (enhanced and animated)
function ArrowDownSVG() {
    return (
        <svg
            className="w-6 h-6 text-emerald-500 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    );
}

export default function ModelingDataCard() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full flex flex-col items-center py-12 font-montserrat">
            <h2 className="text-4xl font-bold text-chrysler-blue-600 text-center mb-12">
                Modeling Data
            </h2>

            <div className="flex flex-col items-center gap-10 max-w-4xl px-4">
                {loading
                    ? steps.map((_, index) => (
                          <SkeletonCard key={index} isLast={index === steps.length - 1} />
                      ))
                    : steps.map((step, index) => (
                          <React.Fragment key={index}>
                              <div className="relative w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
                                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 bg-emerald-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow font-bold">
                                      {index + 1}
                                  </div>
                                  <h3 className="text-xl font-semibold text-chrysler-blue-600 mb-3 text-center">
                                      {step.title}
                                  </h3>
                                  <p className="text-sm text-emerald-600 text-justify">
                                      {step.description}
                                  </p>
                              </div>
                              {index < steps.length - 1 && <ArrowDownSVG />}
                          </React.Fragment>
                      ))}
            </div>
        </div>
    );
}
