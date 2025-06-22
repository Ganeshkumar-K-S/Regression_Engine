import React, { useState, useEffect } from 'react';

export default function NullHandling({ nullAttributes, attributes }) {
  const [selectedMethods, setSelectedMethods] = useState({});

  const methodMapping = {
    drop: 1,
    custom: 2,
    forward: 3,
    backward: 4,
    mean_mode: 5,
    median_mode: 6,
  };

  // Set default method to 'mean_mode' on load
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
      } else {
        console.log(`Error: ${data.error}`);
      }
    } catch (err) {
      console.log(`Exception: ${err.message}`);
    }
  };

  return (
    <div className="-m-1.5 p-4 font-montserrat">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center text-purple-700">
        🛠️ Treating Null Values
      </h2>

      <div className="relative overflow-x-auto rounded">
        {/* Fixed first column */}
        <div className="absolute left-0 top-0 z-10 w-48 bg-[var(--color-honeydew-800)]">
          <div className="px-6 py-3 text-xs font-semibold uppercase text-[var(--color-chrysler-blue-400)] bg-[var(--color-honeydew-800)] h-[49px] flex items-center justify-center">
            Attribute
          </div>
          <div>
            {nullAttributes && nullAttributes.map(([attr], idx) => (
              <div
                key={idx}
                className="px-6 py-4 whitespace-nowrap font-semibold text-sm text-gray-800 bg-[var(--color-honeydew-800)] backdrop-blur-sm hover:bg-white/10 transition-colors flex items-center h-[57px]"
              >
                {attr}
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="pl-48 overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header */}
            <div className="flex bg-[var(--color-honeydew-800)] h-[49px]">
              {["Drop Null", "Custom Null", "Forward Fill", "Backward Fill", "Mean & Mode", "Median & Mode"].map((title, i) => (
                <div
                  key={i}
                  className="flex-1 px-6 py-3 text-xs text-center font-semibold uppercase text-[var(--color-chrysler-blue-400)] flex items-center justify-center min-w-0"
                >
                  {title}
                </div>
              ))}
            </div>

            {/* Rows */}
            {nullAttributes && nullAttributes.map(([attr], idx) => (
              <div
                key={idx}
                className="flex hover:bg-white/10 transition-colors h-[57px]"
              >
                {/* Drop Null */}
                <div className="flex-1 px-6 py-4 flex items-center justify-center min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked(attr, 'drop')}
                    onChange={() => handleCheckboxChange(attr, 'drop')}
                    className="accent-[var(--color-tea-green-300)]"
                  />
                </div>

                {/* Custom Null */}
                <div className="flex-1 px-6 py-4 flex items-center justify-center min-w-0">
                  <input
                    id={`custom-input-${attr}`}
                    type="text"
                    defaultValue={getValue(attr)}
                    placeholder={getValue(attr)}
                    onFocus={() => handleCheckboxChange(attr, 'custom')}
                    className={`w-24 px-2 py-1 rounded text-center placeholder-gray-400 text-gray-800 ${
                      isChecked(attr, 'custom') ? '' : 'opacity-40 cursor-not-allowed'
                    }`}
                    style={{
                      border: '1px solid var(--color-celadon-400)',
                      backgroundColor: 'transparent',
                    }}
                    readOnly={!isChecked(attr, 'custom')}
                  />
                </div>

                {/* Forward Fill */}
                <div className="flex-1 px-6 py-4 flex items-center justify-center min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked(attr, 'forward')}
                    onChange={() => handleCheckboxChange(attr, 'forward')}
                    className="accent-[var(--color-tea-green-300)]"
                  />
                </div>

                {/* Backward Fill */}
                <div className="flex-1 px-6 py-4 flex items-center justify-center min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked(attr, 'backward')}
                    onChange={() => handleCheckboxChange(attr, 'backward')}
                    className="accent-[var(--color-tea-green-300)]"
                  />
                </div>

                {/* Mean & Mode */}
                <div className="flex-1 px-6 py-4 flex items-center justify-center min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked(attr, 'mean_mode')}
                    onChange={() => handleCheckboxChange(attr, 'mean_mode')}
                    className="accent-[var(--color-tea-green-300)]"
                  />
                </div>

                {/* Median & Mode */}
                <div className="flex-1 px-6 py-4 flex items-center justify-center min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked(attr, 'median_mode')}
                    onChange={() => handleCheckboxChange(attr, 'median_mode')}
                    className="accent-[var(--color-tea-green-300)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Treat Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleTreatNull}
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors font-semibold font-montserrat"
        >
          Treat
        </button>
      </div>
    </div>
  );
}
