import React, { useEffect, useRef, useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import useTooltip from '../hooks/useTooltip.jsx';

export default function FeatureSelector({
  attributes,
  features,
  setFeatures,
  target,
  setTarget,
  targetError,
  setTargetError
}) {
  const featureRefs = useRef([]);
  const targetRef = useRef(null);
  const { showTooltip, hideTooltip, Tooltip } = useTooltip();
  const [nullAttributes, setNullAttributes] = useState({});

  useEffect(() => {
    if (targetError) {
      const timer = setTimeout(() => setTargetError(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [targetError, setTargetError]);

  const handleFeatureMouseEnter = (index, key) => {
    const el = featureRefs.current[index];
    if (el) {
      showTooltip(el, key);
    }
  };

  const handleTargetMouseEnter = (key) => {
    const el = targetRef.current;
    if (el) {
      showTooltip(el, key);
    }
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  const handleStart = async () => {
    try {
      // Step 1: POST to /gettargetfeature
      const targetFeatureResponse = await fetch('http://localhost:5000/api/gettargetfeature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ target, feature: features })
      });

      const targetFeatureData = await targetFeatureResponse.json();
      if (targetFeatureData.error) {
        console.error('Error from /gettargetfeature:', targetFeatureData.error);
        setTargetError(targetFeatureData.error);
        return;
      }

      // Step 2: GET from /getnull
      const nullResponse = await fetch('http://localhost:5000/api/getnull');
      const nullData = await nullResponse.json();

      if (nullData.error) {
        console.error('Error from /getnull:', nullData.error);
        setTargetError(nullData.error);
      } else {
        console.log('Null attributes:', nullData);
        setNullAttributes(nullData); // You can use this data to show in UI
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setTargetError('An unexpected error occurred');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-montserrat relative">
      <h2 className="text-2xl font-semibold mb-4 text-center text-purple-700">
        🎯 Feature and Target Selector
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-44">
        {/* Features Grid */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-2 text-purple-700">Features</h3>
          <Droppable droppableId="features" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="border rounded-lg p-4 bg-gray-50 shadow-inner grid grid-cols-3 gap-4 min-h-[5rem]"
              >
                {features.map((key, index) => (
                  <Draggable key={key} draggableId={key} index={index}>
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
                          className="p-3 text-sm-montserrat rounded border shadow cursor-grab overflow-hidden 
                                     bg-white text-purple-700 border-purple-300 hover:bg-purple-100 transition-colors duration-200"
                        >
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                            {key}
                          </span>
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

        {/* Target Grid */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-purple-700">Target</h3>
          <Droppable droppableId="target" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="border rounded-lg p-4 bg-gray-50 shadow-inner grid grid-cols-1 gap-4 min-h-[5rem]"
              >
                {target && (
                  <Draggable draggableId={target} index={0}>
                    {(provided) => (
                      <div className="relative group">
                        <div
                          ref={(el) => {
                            provided.innerRef(el);
                            targetRef.current = el;
                          }}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onMouseEnter={() => handleTargetMouseEnter(target)}
                          onMouseLeave={handleMouseLeave}
                          className="p-3 text-sm-montserrat rounded border shadow cursor-grab overflow-hidden 
                                     bg-white text-purple-700 border-purple-300 hover:bg-purple-100 transition-colors duration-200"
                        >
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                            {target}
                          </span>
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

      <div className="text-center mt-8">
        <button
          onClick={handleStart}
          className="px-6 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
        >
          🚀 Start
        </button>
      </div>
    </div>
  );
}
