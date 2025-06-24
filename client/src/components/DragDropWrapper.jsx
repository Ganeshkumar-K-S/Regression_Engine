import React, { useEffect , useState } from 'react';
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
  nullAttributes,
  setNullAttributes
}) {
  const [isLocked, setIsLocked] = useState(false);


  // Clear state on file removal
  useEffect(() => {
    if (!uploadedFile || !uploadUUID) {
      setAttributes({});
      setFeatures([]);
      setTarget('');
    }
  }, [uploadedFile, uploadUUID, setAttributes, setFeatures, setTarget]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const dest = destination.droppableId;

    // Prevent re-dragging into same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (dest === 'features') {
      if (!features.includes(draggableId) && draggableId !== target) {
        setFeatures((prev) => [...prev, draggableId]);
      }
    }

    if (dest === 'target') {
      const isNumerical = attributes[draggableId]; 
      if (isNumerical === true) {
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
        features={features}
        target={target}
        isLocked={isLocked}
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
          nullAttributes={nullAttributes}
          setNullAttributes={setNullAttributes}
          isLocked={isLocked}
          setIsLocked={setIsLocked}
        />
      )}
    </DragDropContext>
  );
}
