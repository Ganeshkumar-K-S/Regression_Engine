import React, { useEffect, useRef } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import useTooltip from '../hooks/useTooltip.jsx';

export default function FeatureSelector({
  attributes,
  features,
  setFeatures,
  target,
  setTarget,
  targetError,
  setTargetError,
  nullAttributes,
  setNullAttributes,
  isLocked,
  setIsLocked
}) {
  const featureRefs = useRef([]);
  const targetRef = useRef(null);
  const { showTooltip, hideTooltip, Tooltip } = useTooltip();

  useEffect(() => {
    if (targetError) {
      const timer = setTimeout(() => setTargetError(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [targetError, setTargetError]);

  const handleFeatureMouseEnter = (index, key) => {
    const el = featureRefs.current[index];
    if (el) showTooltip(el, key);
  };

  const handleTargetMouseEnter = (key) => {
    const el = targetRef.current;
    if (el) showTooltip(el, key);
  };

  const handleMouseLeave = () => hideTooltip();

  const handleRemoveFeature = (key) => {
    setFeatures(prev => prev.filter(item => item !== key));
  };

  const handleRemoveTarget = () => {
    setTarget('');
  };

  const handleStart = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/gettargetfeature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ target, feature: features }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (data.error) {
        setTargetError(data.error);
        return;
      }

      const nullRes = await fetch('http://localhost:5000/api/getnull', {
        credentials: 'include'
      });

      if (!nullRes.ok) throw new Error(`HTTP error! status: ${nullRes.status}`);

      const nullData = await nullRes.json();

      if (nullData.error) setTargetError(nullData.error);
      else {
        setNullAttributes(nullData);
        setIsLocked(true);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setTargetError(`An unexpected error occurred: ${err.message}`);
    }
  };

  const removeButton = (onClickHandler) => (
    <button
      type="button"
      onClick={onClickHandler}
      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 inline-flex items-center justify-center text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-400"
      title="Remove"
    >
      <span className="sr-only">Remove</span>
      <svg
        className="h-3 w-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto font-montserrat">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-purple-700">
        🎯 Feature and Target Selector
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Features Section */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-2 text-purple-700">Features</h3>
          <Droppable droppableId="features" isDropDisabled={isLocked}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`border rounded-lg p-4 shadow-inner min-h-[5rem] flex flex-wrap gap-3 transition-colors duration-200 ${
                  snapshot.isDraggingOver 
                    ? 'bg-purple-100 border-purple-400' 
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                {features.map((key, index) => (
                  <Draggable key={key} draggableId={key} index={index} isDragDisabled={isLocked}>
                    {(provided) => (
                      <div className="relative group">
                        <div
                          ref={(el) => {
                            provided.innerRef(el);
                            featureRefs.current[index] = el;
                          }}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onMouseEnter={() => handleFeatureMouseEnter(index, key)}
                          onMouseLeave={handleMouseLeave}
                          className="p-3 text-sm-montserrat rounded border shadow cursor-grab bg-white text-purple-700 border-purple-300 hover:bg-purple-100 transition duration-200 relative min-w-[120px] max-w-[200px] flex items-center justify-center text-center"
                        >
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap pr-6">{key}</span>
                          {!isLocked && removeButton(() => handleRemoveFeature(key))}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Target Section */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h3 className="text-lg font-semibold mb-2 text-purple-700">Target</h3>
          <Droppable droppableId="target" isDropDisabled={isLocked}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`border rounded-lg p-4 shadow-inner min-h-[5rem] flex items-center justify-center transition-colors duration-200 ${
                  snapshot.isDraggingOver 
                    ? 'bg-purple-100 border-purple-400' 
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                {target && (
                  <Draggable draggableId={target} index={0} isDragDisabled={isLocked}>
                    {(provided) => (
                      <div className="relative group w-full">
                        <div
                          ref={(el) => {
                            provided.innerRef(el);
                            targetRef.current = el;
                          }}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onMouseEnter={() => handleTargetMouseEnter(target)}
                          onMouseLeave={handleMouseLeave}
                          className="p-3 text-sm-montserrat rounded border shadow cursor-grab bg-white text-purple-700 border-purple-300 hover:bg-purple-100 transition duration-200 relative text-center"
                        >
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap pr-6">{target}</span>
                          {!isLocked && removeButton(handleRemoveTarget)}
                        </div>
                      </div>
                    )}
                  </Draggable>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {targetError && (
            <p className="mt-2 text-sm text-red-600 font-medium">{targetError}</p>
          )}
        </div>
      </div>

      <Tooltip />

      {/* Start Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleStart}
          disabled={isLocked}
          className="px-6 py-2 rounded bg-purple-600 text-white font-semibold font-montserrat hover:bg-purple-700 transition disabled:opacity-50"
        >
          🚀 Start
        </button>
      </div>
    </div>
  );
}
