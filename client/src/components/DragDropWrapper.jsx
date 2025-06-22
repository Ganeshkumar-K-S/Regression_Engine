import React, { useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Attributes from './Attributes';
import FeatureSelector from './FeatureSelector';

export default function DragDropWrapper({
  uploadedFile,
  uploadUUID,
  attributes,
  setAttributes,
  features,
  setFeatures,
  target,
  setTarget,
  targetError,
  setTargetError,
}) {
  // Clear everything when file is removed
  useEffect(() => {
    if (!uploadedFile || !uploadUUID) {
      setAttributes({});
      setFeatures([]);
      setTarget('');
    }
  }, [uploadedFile, uploadUUID, setAttributes, setFeatures, setTarget]);

  // Handle drag end logic
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const dest = destination.droppableId;

    if (dest === 'features') {
      if (!features.includes(draggableId) && draggableId !== target) {
        setFeatures((prev) => [...prev, draggableId]);
      }
    }

    if (dest === 'target') {
      if (attributes[draggableId] === true) {
        setTarget(draggableId);
        setFeatures((prev) => prev.filter((f) => f !== draggableId));
        setTargetError('');
      } else {
        setTargetError('❌ Target attribute must be Numerical');
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Attributes
        uploadedFile={uploadedFile}
        uploadUUID={uploadUUID}
        attributes={attributes}
        setAttributes={setAttributes}
      />
      {Object.keys(attributes).length > 0 && (
        <FeatureSelector
          attributes={attributes}
          features={features}
          setFeatures={setFeatures}
          target={target}
          setTarget={setTarget}
          targetError={targetError}
          setTargetError={setTargetError}
        />
      )}
    </DragDropContext>
  );
}
