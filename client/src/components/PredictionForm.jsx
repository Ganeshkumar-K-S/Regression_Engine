import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';

export default function PredictionForm({ features, target, attributes }) {
    const [inputs, setInputs] = useState({});
    const [categoricalOptions, setCategoricalOptions] = useState({});
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initial = {};
        features.forEach((feature) => {
            if (attributes[feature] === true) {
                initial[feature] = { value: 0, num: true };
            } else {
                initial[feature] = { value: attributes[feature], num: false };
            }
        });
        setInputs(initial);
    }, [features, attributes]);

    useEffect(() => {
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
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
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
        <div className="flex flex-col items-center justify-center font-montserrat p-13 space-y-8">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-purple-700 text-center"
            >
                🔮 Predict {target}
            </motion.h2>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row gap-10 w-full max-w-6xl justify-center"
            >
                <div className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl w-full md:w-[620px] transition-all duration-500 font-montserrat shadow-lg hover:shadow-2xl hover:scale-[1.01] p-6">
                    <h3 className="text-xl font-semibold text-chrysler-blue-600 mb-3">Numerical Features</h3>
                    <div className="space-y-3">
                        {loading
                            ? [...Array(3)].map((_, i) => <Skeleton key={i} height={32} />)
                            : numericKeys.map((key) => (
                                <div key={key} className="flex items-center gap-4 justify-between">
                                    <label className="w-1/2 text-sm text-chrysler-blue-600">{key}</label>
                                    <input
                                        type="number"
                                        value={inputs[key]?.value}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        className="w-28 px-3 py-1.5 rounded border border-gray-300 bg-white text-celadon-200 focus:outline-none focus:ring-2 focus:ring-celadon-300"
                                    />
                                </div>
                            ))}
                    </div>
                </div>

                <div className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl w-full md:w-[620px] transition-all duration-500 font-montserrat shadow-lg hover:shadow-2xl hover:scale-[1.01] p-6">
                    <h3 className="text-xl font-semibold text-chrysler-blue-600 mb-3">Categorical Features</h3>
                    <div className="space-y-3">
                        {loading
                            ? [...Array(3)].map((_, i) => <Skeleton key={i} height={32} />)
                            : categoricalKeys.map((key) => (
                                <div key={key} className="flex items-center gap-4 justify-between">
                                    <label className="w-1/2 text-sm text-chrysler-blue-600">{key}</label>
                                    <div className="w-28">
                                        <Select
                                            options={categoricalOptions[key] || []}
                                            value={{ label: inputs[key]?.value, value: inputs[key]?.value }}
                                            onChange={(selected) => handleSelectChange(key, selected)}
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    minHeight: '32px',
                                                    fontSize: '0.85rem',
                                                    borderColor: state.isFocused ? '#38c06a' : '#ccc',
                                                    backgroundColor: '#ffffff',
                                                    boxShadow: state.isFocused ? '0 0 0 1px #38c06a' : 'none',
                                                }),
                                                singleValue: (base) => ({
                                                    ...base,
                                                    color: '#258047',
                                                    fontWeight: 500,
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    backgroundColor: '#ffffff',
                                                }),
                                                option: (base, state) => ({
                                                    ...base,
                                                    backgroundColor: state.isFocused ? '#b3e9c7' : '#ffffff',
                                                    color: '#258047',
                                                    cursor: 'pointer',
                                                }),
                                                dropdownIndicator: (base) => ({
                                                    ...base,
                                                    padding: 4,
                                                    color: '#258047',
                                                }),
                                                indicatorSeparator: () => ({
                                                    display: 'none',
                                                }),
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </motion.div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={submit}
                className="px-6 py-2 rounded bg-purple-600 text-white font-semibold font-montserrat hover:bg-purple-700 transition border-none"
                disabled={loading}
            >
                🎯 Get Prediction
            </motion.button>

            {error && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-center"
                >
                    Error: {error}
                </motion.p>
            )}

            {prediction !== null && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-celadon-300 text-lg font-semibold font-montserrat"
                >
                    Predicted price: {prediction}
                </motion.div>
            )}
        </div>
    );
}
