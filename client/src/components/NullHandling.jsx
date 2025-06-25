import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function NullHandling({ nullAttributes, attributes, nullTreated, setNullTreated }) {
    const [selectedMethods, setSelectedMethods] = useState({});

    const methodMapping = {
        drop: 1,
        custom: 2,
        forward: 3,
        backward: 4,
        mean_mode: 5,
        median_mode: 6,
    };

    useEffect(() => {
        if (nullAttributes) {
            const initial = {};
            nullAttributes.forEach(([attr]) => {
                initial[attr] = 'mean_mode';
            });
            setSelectedMethods(initial);
        }
    }, [nullAttributes]);

    const handleCheckboxChange = (attr, method) => {
        setSelectedMethods((prev) => ({
            ...prev,
            [attr]: method,
        }));
    };

    const isChecked = (attr, method) => selectedMethods[attr] === method;

    const getValue = (attr) => {
        const val = attributes[attr];
        return val === true ? '0' : 'Nan';
    };

    const handleTreatNull = async () => {
        const payload = {};
        for (const attr in selectedMethods) {
            const method = selectedMethods[attr];
            payload[attr] = {
                method: methodMapping[method],
            };

            if (method === 'custom') {
                const inputElement = document.getElementById(`custom-input-${attr}`);
                const val = inputElement?.value ?? '';
                payload[attr].value = isNaN(val) ? val : Number(val);
            }
        }

        try {
            const res = await fetch('http://localhost:5000/api/treat-null', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                console.log('Null treatment applied successfully');
                setNullTreated(true);
            } else {
                console.log(`Error: ${data.error}`);
            }
        } catch (err) {
            console.log(`Exception: ${err.message}`);
        }
    };

    const loading = !nullAttributes || nullAttributes.length === 0;

    return (
        <div className="-m-1.5 p-4 font-montserrat">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center text-chrysler-blue-600">
                🛠️ Treating Null Values
            </h2>

            <div className="relative overflow-x-auto rounded">
                {/* Fixed first column */}
                <div className="absolute left-0 top-0 z-10 w-48 bg-[var(--color-honeydew-800)]">
                    <div className="px-6 py-3 text-md-montserrat font-semibold text-[var(--color-chrysler-blue-400)] bg-[var(--color-honeydew-800)] h-[56px] flex items-center justify-center">
                        Attribute
                    </div>
                    <div>
                        {(loading ? Array(5).fill(null) : nullAttributes).map((item, idx) => (
                            <div
                                key={idx}
                                className="px-6 py-4 font-semibold text-sm text-chrysler-blue-700 bg-[var(--color-honeydew-800)] backdrop-blur-sm hover:bg-white/10 transition-colors flex items-center h-[57px]"
                            >
                                {loading ? (
                                    <Skeleton height={18} width={80} />
                                ) : (
                                    item[0]
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scrollable content area */}
                <div className="pl-48 overflow-x-auto">
                    <div className="min-w-[700px]">
                        {/* Header */}
                        <div className="flex bg-[var(--color-honeydew-800)] h-[56px]">
                            {[
                                'Drop Null',
                                'Custom Null',
                                'Forward Fill',
                                'Backward Fill',
                                'Mean & Mode',
                                'Median & Mode',
                            ].map((title, i) => (
                                <div
                                    key={i}
                                    className="flex-1 px-6 py-3 text-center text-md-montserrat font-semibold text-[var(--color-chrysler-blue-400)] flex items-center justify-center min-w-0"
                                >
                                    {title}
                                </div>
                            ))}
                        </div>

                        {/* Rows */}
                        {(loading ? Array(5).fill(null) : nullAttributes).map((item, idx) => {
                            const attr = loading ? `attr_${idx}` : item[0];

                            return (
                                <div key={idx} className="flex hover:bg-white/10 transition-colors h-[57px]">
                                    {/* Drop */}
                                    <div className="flex-1 px-6 py-4 flex items-center justify-center min-w-0">
                                        {loading ? <Skeleton circle height={18} width={18} /> : (
                                            <input
                                                type="checkbox"
                                                disabled={nullTreated}
                                                checked={isChecked(attr, 'drop')}
                                                onChange={() => handleCheckboxChange(attr, 'drop')}
                                                className="accent-[var(--color-tea-green-300)]"
                                            />
                                        )}
                                    </div>

                                    {/* Custom */}
                                    <div className="flex-1 px-6 py-4 flex items-center justify-center min-w-0">
                                        {loading ? (
                                            <Skeleton width={60} height={30} />
                                        ) : (
                                            <input
                                                id={`custom-input-${attr}`}
                                                type="text"
                                                defaultValue={getValue(attr)}
                                                placeholder={getValue(attr)}
                                                onFocus={() => handleCheckboxChange(attr, 'custom')}
                                                readOnly={!isChecked(attr, 'custom') || nullTreated}
                                                disabled={nullTreated}
                                                className={`w-24 px-2 py-1 rounded text-center placeholder-gray-400 text-gray-800 ${
                                                    isChecked(attr, 'custom') ? '' : 'opacity-40 cursor-not-allowed'
                                                }`}
                                                style={{
                                                    border: '1px solid var(--color-celadon-400)',
                                                    backgroundColor: 'transparent',
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Forward */}
                                    <div className="flex-1 px-6 py-4 flex items-center justify-center min-w-0">
                                        {loading ? <Skeleton circle height={18} width={18} /> : (
                                            <input
                                                type="checkbox"
                                                disabled={nullTreated}
                                                checked={isChecked(attr, 'forward')}
                                                onChange={() => handleCheckboxChange(attr, 'forward')}
                                                className="accent-[var(--color-tea-green-300)]"
                                            />
                                        )}
                                    </div>

                                    {/* Backward */}
                                    <div className="flex-1 px-6 py-4 flex items-center justify-center min-w-0">
                                        {loading ? <Skeleton circle height={18} width={18} /> : (
                                            <input
                                                type="checkbox"
                                                disabled={nullTreated}
                                                checked={isChecked(attr, 'backward')}
                                                onChange={() => handleCheckboxChange(attr, 'backward')}
                                                className="accent-[var(--color-tea-green-300)]"
                                            />
                                        )}
                                    </div>

                                    {/* Mean & Mode */}
                                    <div className="flex-1 px-6 py-4 flex items-center justify-center min-w-0">
                                        {loading ? <Skeleton circle height={18} width={18} /> : (
                                            <input
                                                type="checkbox"
                                                disabled={nullTreated}
                                                checked={isChecked(attr, 'mean_mode')}
                                                onChange={() => handleCheckboxChange(attr, 'mean_mode')}
                                                className="accent-[var(--color-tea-green-300)]"
                                            />
                                        )}
                                    </div>

                                    {/* Median & Mode */}
                                    <div className="flex-1 px-6 py-4 flex items-center justify-center min-w-0">
                                        {loading ? <Skeleton circle height={18} width={18} /> : (
                                            <input
                                                type="checkbox"
                                                disabled={nullTreated}
                                                checked={isChecked(attr, 'median_mode')}
                                                onChange={() => handleCheckboxChange(attr, 'median_mode')}
                                                className="accent-[var(--color-tea-green-300)]"
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Button */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={handleTreatNull}
                    disabled={nullTreated || loading}
                    className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors font-semibold font-montserrat disabled:opacity-50"
                >
                    🛠️ Treat Null & Build Model
                </button>
            </div>
        </div>
    );
}
