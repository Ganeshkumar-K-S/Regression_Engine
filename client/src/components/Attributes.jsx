import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import useTooltip from '../hooks/useTooltip.jsx';

export default function Attributes({ uploadedFile, uploadUUID, attributes, setAttributes, features, target, isLocked }) {

  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const refs = useRef([]);
  const { showTooltip, hideTooltip, Tooltip } = useTooltip();

  useEffect(() => {
    if (!uploadedFile || !uploadUUID) return;

    const name = uploadUUID;
    const extension = uploadedFile.name.split('.').pop().toLowerCase();

    const fetchAttributes = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/getattributes/${name}/${extension}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setAttributes(data);
        setError('');
      } catch (err) {
        setError('Failed to load attributes: ' + err.message);
        setAttributes([]);
      }
    };

    fetchAttributes();
  }, [uploadedFile, uploadUUID, setAttributes]);

  useEffect(() => {
    if (!uploadedFile || !uploadUUID) {
      setAttributes({});
    }
  }, [uploadedFile, uploadUUID, setAttributes]);

  const filteredAttributes = useMemo(() => {
    if (!attributes || typeof attributes !== 'object') return [];

    const used = new Set([...(features || []), target]);

    return Object.keys(attributes)
      .filter(attr =>
        attr.toLowerCase().includes(search.toLowerCase()) && !used.has(attr)
      );
  }, [attributes, search, features, target]);


  const handleMouseEnter = (index, key) => {
    const el = refs.current[index];
    if (el) {
      showTooltip(el, key);
    }
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  if (!uploadedFile || !attributes) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto font-montserrat relative">
      <h2 className="text-2xl font-semibold mb-4 text-center text-purple-700">🧩 Attribute Keys</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <input
        type="text"
        placeholder="Search attributes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded text-md-montserrat border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />

      <Tooltip />

      <Droppable droppableId="attributes" isDropDisabled={true} isCombineEnabled={false} isDragDisabled={isLocked}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="border rounded-lg p-4 bg-gray-50 shadow-inner max-h-64 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {filteredAttributes.map((key, index) => (
              <Draggable key={key} draggableId={key} index={index} isDragDisabled={isLocked}>
                {(provided) => (
                  <div className="relative group">
                    <div
                      ref={(el) => {
                        provided.innerRef(el);
                        refs.current[index] = el;
                      }}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onMouseEnter={() => handleMouseEnter(index, key)}
                      onMouseLeave={handleMouseLeave}
                      className="p-3 text-sm-montserrat rounded border shadow cursor-grab overflow-hidden 
                                 bg-white text-purple-700 border-purple-300 
                                 hover:bg-purple-100 transition-colors duration-200"
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
  );
}
