import React, { useEffect, useState } from 'react';
import Select from 'react-select';

export default function PredictionForm({ features, target, attributes }) {
    const [inputs, setInputs] = useState({});
    const [categoricalOptions, setCategoricalOptions] = useState({});
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize inputs
        const initial = {};
        features.forEach((feature) => {
            if (attributes[feature] === true) {
                initial[feature] = { value: 0, num: true }; // Numerical
            } else {
                initial[feature] = { value: attributes[feature], num: false }; // Categorical default
            }
        });
        setInputs(initial);
    }, [features, attributes]);

    useEffect(() => {
        // Fetch categorical values
        fetch('http://localhost:5000/api/getfeaturevalues', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.Error) throw new Error(data.Error);
                const formatted = {};
                for (const key in data) {
                    formatted[key] = data[key].map((val) => ({
                        value: val,
                        label: val,
                    }));
                }
                setCategoricalOptions(formatted);
            })
            .catch((err) => setError(err.message));
    }, []);

    const handleChange = (key, val) => {
        setInputs((prev) => ({
            ...prev,
            [key]: { ...prev[key], value: val }
        }));
    };

    const handleSelectChange = (key, selectedOption) => {
        handleChange(key, selectedOption.value);
    };

    const submit = async () => {
        setError('');
        setPrediction(null);
        try {
            const payload = {};
            Object.entries(inputs).forEach(([key, { value, num }]) => {
                payload[key] = { value: num ? parseFloat(value) : value, num };
            });

            const res = await fetch('http://localhost:5000/api/getprediction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include',
            });

            const data = await res.json();
            if (data.Error) throw new Error(data.Error);
            setPrediction(data.result);
        } catch (e) {
            setError(e.message);
        }
    };

    const numericKeys = Object.keys(inputs).filter((k) => inputs[k].num);
    const categoricalKeys = Object.keys(inputs).filter((k) => !inputs[k].num);

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Predict {target}</h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Numerical Inputs */}
                <div>
                    <h3 className="text-xl font-medium mb-2">Numerical Features</h3>
                    {numericKeys.map((key) => (
                        <div key={key} className="mb-4">
                            <label className="block text-sm font-medium mb-1">{key}</label>
                            <input
                                type="number"
                                value={inputs[key]?.value}
                                onChange={(e) => handleChange(key, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    ))}
                </div>

                {/* Categorical Dropdowns */}
                <div>
                    <h3 className="text-xl font-medium mb-2">Categorical Features</h3>
                    {categoricalKeys.map((key) => (
                        <div key={key} className="mb-4">
                            <label className="block text-sm font-medium mb-1">{key}</label>
                            <Select
                                options={categoricalOptions[key] || []}
                                value={{ label: inputs[key]?.value, value: inputs[key]?.value }}
                                onChange={(selected) => handleSelectChange(key, selected)}
                                isSearchable
                                className="text-sm"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={submit}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Get Prediction
            </button>

            {error && <p className="mt-4 text-red-600">Error: {error}</p>}

            {prediction !== null && (
                <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded">
                    <strong>Predicted {target}:</strong> {prediction}
                </div>
            )}
        </div>
    );
}
