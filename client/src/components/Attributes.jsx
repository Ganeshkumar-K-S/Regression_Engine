import React, { useEffect, useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function Attributes({ uploadedFile }) {
  const [attributes, setAttributes] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAttributes = async () => {
      if (!uploadedFile) return;

      const name = 'data';
      const extension = uploadedFile.name.split('.').pop().toLowerCase();

      try {
        const res = await fetch(`http://localhost:5000/api/getattributes/${name}/${extension}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }

        const data = await res.json();
        setAttributes(Object.keys(data)); // We only need keys
        setError('');
      } catch (err) {
        setError('Failed to load attributes: ' + err.message);
        setAttributes(null);
      }
    };

    fetchAttributes();
  }, [uploadedFile]);

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

  if (!uploadedFile) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto font-montserrat">
      <h2 className="text-2xl font-semibold mb-4 text-center text-chrysler-blue-600">🧩 Attribute Keys</h2>

      {error && <p className="text-red-600">{error}</p>}

      <input
        type="text"
        placeholder="Search attributes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-chrysler-blue-600 text-md-montserrat"
      />

      {attributes && (
        <div className="border rounded-lg p-4 bg-gray-50 shadow-inner max-h-64 overflow-y-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="attribute-keys">
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                  {filteredAttributes.map((key, index) => (
                    <Draggable key={key} draggableId={key} index={index}>
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 text-sm-montserrat text-chrysler-blue-600 rounded border shadow cursor-grab hover:bg-chrysler-blue-100"
                        >
                          {key}
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
