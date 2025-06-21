import React, { useEffect, useState, useMemo, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function Attributes({ uploadedFile, uploadUUID, attributes, setAttributes }) {
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [visibleTooltipIndex, setVisibleTooltipIndex] = useState(null);
  const refs = useRef([]);
  const tooltipRef = useRef(null);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipStyle, setTooltipStyle] = useState({});

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
        setAttributes(Object.keys(data));
        setError('');
      } catch (err) {
        setError('Failed to load attributes: ' + err.message);
        setAttributes(null);
      }
    };

    fetchAttributes();
  }, [uploadedFile, uploadUUID, setAttributes]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(attributes);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setAttributes(reordered);
  };

  const filteredAttributes = useMemo(() => {
    if (!attributes) return [];
    return attributes.filter(attr =>
      attr.toLowerCase().includes(search.toLowerCase())
    );
  }, [attributes, search]);

  const handleMouseEnter = (index, key) => {
    const el = refs.current[index];
    if (el && el.scrollWidth > el.clientWidth) {
      const rect = el.getBoundingClientRect();
      setTooltipStyle({
        top: `${rect.top - 42}px`,
        left: `${rect.left + rect.width / 2}px`,
      });
      setTooltipContent(key);
      setVisibleTooltipIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setVisibleTooltipIndex(null);
    setTooltipContent('');
  };

  if (!uploadedFile) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto font-montserrat relative">
      <h2 className="text-2xl font-semibold mb-4 text-center" style={{ color: 'var(--color-chrysler-blue-600)' }}>
        🧩 Attribute Keys
      </h2>

      {error && <p className="text-red-600">{error}</p>}

      <input
        type="text"
        placeholder="Search attributes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 text-md-montserrat"
        style={{
          borderColor: 'var(--color-chrysler-blue-300)',
          outlineColor: 'var(--color-chrysler-blue-600)',
        }}
      />

      {/* Tooltip floating above all */}
      {visibleTooltipIndex !== null && (
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            transform: 'translateX(-50%)',
            zIndex: 50,
            ...tooltipStyle,
            backgroundColor: 'var(--color-chrysler-blue-600)',
            color: 'white',
          }}
          className="px-3 py-2 text-sm font-medium rounded-lg shadow-lg transition-opacity duration-200"
          role="tooltip"
        >
          {tooltipContent}
          <div className="tooltip-arrow" />
        </div>
      )}

      {attributes && (
        <div className="border rounded-lg p-4 bg-gray-50 shadow-inner max-h-64 overflow-y-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="attribute-keys">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                  {filteredAttributes.map((key, index) => (
                    <Draggable key={key} draggableId={key} index={index}>
                      {(provided) => (
                        <div
                          onMouseEnter={() => handleMouseEnter(index, key)}
                          onMouseLeave={handleMouseLeave}
                          className="relative group"
                        >
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-3 text-sm-montserrat rounded border shadow cursor-grab overflow-hidden 
                                      bg-white text-[color:var(--color-chrysler-blue-600)] 
                                      border-[color:var(--color-chrysler-blue-200)] 
                                      hover:bg-gray-200 transition-colors duration-200"
                          >

                            <span
                              ref={(el) => (refs.current[index] = el)}
                              className="block overflow-hidden text-ellipsis whitespace-nowrap"
                            >
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
          </DragDropContext>
        </div>
      )}
    </div>
  );
}
